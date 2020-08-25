// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { File } from '@framework/system/file-system/File.js';
import { WebServer } from '@framework/system/web/server/WebServer.js';
import { WebRequest } from '@framework/system/web/WebRequest.js';
import { Url } from '@framework/system/web/Url.js';

// Class
class WebServerTest extends Test {

	protocol = 'http';
	host = 'localhost';
	port = null;
	baseUrl = null;
	webServer = null;

	async before() {
		var webServerSettings = await File.readAndDecodeJson(app.settings.get('framework.path')+'/system/web/server/tests/settings/settings.json');

		this.port = webServerSettings.modules.webServer.webServers[0].protocols.http.ports[0];

		this.baseUrl = new Url(this.protocol+'://'+this.host+':'+this.port);
		//app.exit(this.baseUrl);

		// Turn off verbose
		webServerSettings.modules.webServer.webServers[0].verbose = false;

		// Set the web server directory
		webServerSettings.modules.webServer.webServers[0].directory = Node.Path.normalize(app.settings.get('framework.path')+'/system/web/server/tests/');

		this.webServer = new WebServer('test', webServerSettings.modules.webServer.webServers[0]);
		await this.webServer.initialize();

		//app.highlight(this.webServer);

		await this.webServer.start();

		// Block the test which will allow me to run requests in the browser against the web server
		//await Function.delay(1000 * 60 * 60);
	}

	async after() {
		await this.webServer.stop();
	}

	// Controller Route for Main.main() - /
	async testRootRoute() {
		//app.info('this.baseUrl', this.baseUrl);

		var webRequest = new WebRequest(this.baseUrl, {});
		var webRequestResponse = await webRequest.execute();
		//app.info('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);
		//app.info('webRequestResponse', webRequestResponse.url);

		Assert.strictEqual(webRequestResponse.statusCode, 200, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'OK', 'statusMessage is correct');
		Assert.strictEqual(webRequestResponse.body, 'Root data.', 'body is correct');
		Assert.strictEqual(webRequestResponse.data, null, 'data is correct');
		Assert.false(webRequestResponse.headers.getHeader('content-type'), '"Content-Type" header is not set');
		Assert.false(webRequestResponse.headers.getHeader('content-disposition'), '"Content-Disposition" header is not set');
		Assert.false(webRequestResponse.headers.getHeader('last-modified'), '"Last-Modified" header is set');
		Assert.false(webRequestResponse.headers.getHeader('etag'), '"ETag" header is set');
		Assert.false(webRequestResponse.headers.getHeader('accept-ranges'), '"Accept-Ranges" header is not set');
		Assert.equal(webRequestResponse.headers.getHeader('content-encoding'), 'gzip', '"Content-Encoding" header is correct');
		Assert.true(webRequestResponse.headers.getHeader('x-processing-time-in-milliseconds'), '"X-Processing-Time-in-Milliseconds" header is set');
		Assert.true(webRequestResponse.headers.getHeader('x-response-id'), '"X-Response-Id" header is set');
		Assert.true(webRequestResponse.headers.getHeader('date'), '"Date" header is set');
		Assert.equal(webRequestResponse.headers.getHeader('connection'), 'close', '"Connection" header is correct');
		Assert.equal(webRequestResponse.headers.getHeader('transfer-encoding'), 'chunked', '"Transfer-Encoding" header is correct');
	}

	// File Route for .txt File - /files/text/data.txt;
	async testFileRouteForTextFile() {
		var webRequest = new WebRequest(this.baseUrl+'files/text/data.txt', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);
		
		Assert.strictEqual(webRequestResponse.statusCode, 200, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'OK', 'statusMessage is correct');
		Assert.strictEqual(webRequestResponse.body, '0123456789', 'body is correct');
		Assert.strictEqual(webRequestResponse.data, null, 'data is correct');
		Assert.equal(webRequestResponse.headers.getHeader('content-type'), 'text/plain', '"Content-Type" header is correct');
		Assert.equal(webRequestResponse.headers.getHeader('content-disposition'), 'inline; filename="data.txt"', '"Content-Disposition" header is correct');
		Assert.true(webRequestResponse.headers.getHeader('last-modified'), '"Last-Modified" header is set');
		Assert.true(webRequestResponse.headers.getHeader('etag'), '"ETag" header is set');
		Assert.equal(webRequestResponse.headers.getHeader('accept-ranges'), 'bytes', '"Accept-Ranges" header is correct');
		Assert.equal(webRequestResponse.headers.getHeader('content-encoding'), 'gzip', '"Content-Encoding" header is correct');
		Assert.true(webRequestResponse.headers.getHeader('x-processing-time-in-milliseconds'), '"X-Processing-Time-in-Milliseconds" header is set');
		Assert.true(webRequestResponse.headers.getHeader('x-response-id'), '"X-Response-Id" header is set');
		Assert.true(webRequestResponse.headers.getHeader('date'), '"Date" header is set');
		Assert.equal(webRequestResponse.headers.getHeader('connection'), 'close', '"Connection" header is correct');
		Assert.equal(webRequestResponse.headers.getHeader('transfer-encoding'), 'chunked', '"Transfer-Encoding" header is correct');
	}

	async testFileRouteForTextFileWithAcceptEncodingIdentity() {
		var webRequest = new WebRequest(this.baseUrl+'files/text/data.txt', {
			headers: {
				'Accept-Encoding': 'identity',
			},
		});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);
		
		Assert.strictEqual(webRequestResponse.statusCode, 200, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'OK', 'statusMessage is correct');
		Assert.strictEqual(webRequestResponse.body, '0123456789', 'body is correct');
		Assert.equal(webRequestResponse.headers.getHeader('content-encoding'), 'identity', '"Content-Encoding" header is correct');
		Assert.equal(webRequestResponse.headers.getHeader('transfer-encoding'), 'chunked', '"Transfer-Encoding" header is correct');
	}

	async testFileRouteForTextFileWithAcceptEncodingNull() {
		var webRequest = new WebRequest(this.baseUrl+'files/text/data.txt', {
			headers: {
				'Accept-Encoding': null,
			},
		});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);
		
		Assert.strictEqual(webRequest.headers.getHeader('accept-encoding'), null, '"Accept-Encoding" header is not set');
		Assert.strictEqual(webRequestResponse.statusCode, 200, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'OK', 'statusMessage is correct');
		Assert.strictEqual(webRequestResponse.body, '0123456789', 'body is correct');
		Assert.equal(webRequestResponse.headers.getHeader('content-encoding'), 'identity', '"Content-Encoding" header is correct');
		Assert.equal(webRequestResponse.headers.getHeader('transfer-encoding'), 'chunked', '"Transfer-Encoding" header is correct');
	}

	async testControllerRouteWithCookies() {
		var webRequest = new WebRequest(this.baseUrl+'cookies', {});
		//app.log('webRequest', webRequest);
		var webRequestResponse = await webRequest.execute();
		//app.info('webRequestResponse', webRequestResponse);

		Assert.equal(webRequestResponse.cookies.get('testCookie1'), 'testCookie1Value', 'First "Set-Cookie" header is correct');
		var expectedTestCookie2 = {
			cookieObjectKey1: ['a', 'b', 'c'],
			cookieObjectKey2: ['d', 'e', 'f'],
		};
		Assert.deepEqual(webRequestResponse.cookies.get('testCookie2'), expectedTestCookie2, 'Second "Set-Cookie" header is correct');
	}

	async testRedirectRoute() {
		var webRequest = new WebRequest(this.baseUrl+'redirect', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 301, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Moved Permanently', 'statusMessage is correct');
		Assert.strictEqual(webRequestResponse.headers.get('location'), 'http://www.system.inc:8181/redirect', 'Location header is correct');
	}

	//async testProxyRoute() {
	//	var webRequest = new WebRequest(this.baseUrl+'proxy', {});
	//	var webRequestResponse = await webRequest.execute();
	//	app.log('webRequest', webRequest);
	//	app.info('webRequestResponse', webRequestResponse);

	//	//Assert.strictEqual(webRequestResponse.statusCode, 301, 'statusCode is correct');
	//	//Assert.strictEqual(webRequestResponse.statusMessage, 'Moved Permanently', 'statusMessage is correct');
	//	//Assert.strictEqual(webRequestResponse.headers.get('location'), 'http://www.system.inc:8181/redirect', 'Location header is correct');
	//}

	async testItemRoute() {
		var webRequest = new WebRequest(this.baseUrl+'items/item1', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.data.itemIdentifier, 'item1', 'Captured data is correct');
		Assert.strictEqual(webRequestResponse.data.view, 'item', 'Data is correct');
		Assert.strictEqual(webRequestResponse.data.root, 'Root data.', 'Inherited data is correct');
	}

	async testRelatedItemRoute() {
		var webRequest = new WebRequest(this.baseUrl+'items/item1/related-items/related1', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.data.itemIdentifier, 'item1', 'Captured data is correct');
		Assert.strictEqual(webRequestResponse.data.relatedItemIdentifier, 'related1', 'Captured data is correct');
		Assert.strictEqual(webRequestResponse.data.view, 'relatedItem', 'Data is correct');
		Assert.strictEqual(webRequestResponse.data.root, 'Root data.', 'Inherited data is correct');
	}

	async testPutOnlyRoute() {
		var webRequest = new WebRequest(this.baseUrl+'put-only', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 404, 'Route does not match when method is not PUT');

		webRequest = new WebRequest(this.baseUrl+'put-only', {
			method: 'PUT',
		});
		webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 200, 'Route matches when the method is PUT');
		Assert.strictEqual(webRequestResponse.body, 'This method is only invoked on requests using the PUT method.', 'PUT only route body is correct');
	}

	async testChildRoutes() {
		// Level one
		var webRequest = new WebRequest(this.baseUrl+'level-one/', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.data.levelOne, 'levelOne', 'First level data is correct');
		Assert.strictEqual(webRequestResponse.data.view, 'levelOne', 'First level data is correct');

		// Level two
		webRequest = new WebRequest(this.baseUrl+'level-one/level-two', {});
		webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.data.levelOne, 'levelOne', 'Data is inherited correctly');
		Assert.strictEqual(webRequestResponse.data.view, 'levelOneLevelTwo', 'Data is inherited correctly');
		Assert.strictEqual(webRequestResponse.data.levelOneLevelTwo, 'levelOneLevelTwo', 'Data is correct');

		// Level three
		webRequest = new WebRequest(this.baseUrl+'level-one/level-two/level-three', {});
		webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.data.levelOne, 'levelOne', 'Data is inherited correctly');
		Assert.strictEqual(webRequestResponse.data.levelOneLevelTwo, 'levelOneLevelTwo', 'Data is inherited correctly');
		Assert.strictEqual(webRequestResponse.data.view, 'levelOneLevelTwoLevelThree', 'Data is inherited correctly');
		Assert.strictEqual(webRequestResponse.data.levelOneLevelTwoLevelThree, 'levelOneLevelTwoLevelThree', 'Data is correct');
	}

	async testHttpErrorNotFoundError() {
		var webRequest = new WebRequest(this.baseUrl+'404', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 404, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Not Found', 'statusMessage is correct');
	}

	async testHttpErrorInternalServerErrorThrownInFunction() {
		var webRequest = new WebRequest(this.baseUrl+'throw-internal-server-error-in-function', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 500, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Internal Server Error', 'statusMessage is correct');
		Assert.strictEqual(webRequestResponse.data.errors.first().message, 'Internal Server Error thrown in function.', 'Error message is correct');
	}

	async testHttpErrorInternalServerErrorThrownInGenerator() {
		var webRequest = new WebRequest(this.baseUrl+'throw-internal-server-error-in-generator', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 500, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Internal Server Error', 'statusMessage is correct');
		Assert.strictEqual(webRequestResponse.data.errors.first().message, 'Internal Server Error thrown in generator.', 'Error message is correct');
	}

	async testHttpErrorBadRequestError() {
		var webRequest = new WebRequest(this.baseUrl+'throw-bad-request-error', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 400, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Bad Request', 'statusMessage is correct');
	}

	async testHttpErrorForbiddenError() {
		var webRequest = new WebRequest(this.baseUrl+'throw-forbidden-error', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 403, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Forbidden', 'statusMessage is correct');
	}

	async testHttpErrorRequestedRangeNotSatisfiableError() {
		var webRequest = new WebRequest(this.baseUrl+'throw-requested-range-not-satisfiable-error', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 416, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Range Not Satisfiable', 'statusMessage is correct');
	}

	async testHttpErrorRequestEntityTooLargeError() {
		var webRequest = new WebRequest(this.baseUrl+'throw-request-entity-too-large-error', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 413, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Payload Too Large', 'statusMessage is correct');
	}

	async testHttpErrorUnauthorizedError() {
		var webRequest = new WebRequest(this.baseUrl+'throw-unauthorized-error', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 401, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Unauthorized', 'statusMessage is correct');
	}

	async testContentIsArchivedFile() {
		var webRequest = new WebRequest(this.baseUrl+'content/archived-file', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.body, 'Text in an archived file inside of an archive file.', 'body is correct');
		Assert.strictEqual(webRequestResponse.headers.get('Content-Type'), 'text/plain', '"Content-Type" header is correct');
		Assert.strictEqual(webRequestResponse.headers.get('Content-Disposition'), 'inline; filename="archived-file-text.txt"', '"Content-Disposition" header is correct');
	}

	async testContentIsFile() {
		var webRequest = new WebRequest(this.baseUrl+'content/file', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.body, '0123456789', 'body is correct');
		Assert.strictEqual(webRequestResponse.headers.get('Content-Type'), 'text/plain', '"Content-Type" header is correct');
		Assert.strictEqual(webRequestResponse.headers.get('Content-Disposition'), 'inline; filename="data.txt"', '"Content-Disposition" header is correct');
	}

	async testContentIsHtmlDocument() {
		var webRequest = new WebRequest(this.baseUrl+'content/html-document', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.body, '<!DOCTYPE html><html><head></head><body><p>Test HTML document.</p></body></html>', 'body is correct');
		Assert.strictEqual(webRequestResponse.headers.get('Content-Type'), 'text/html', '"Content-Type" header is correct');
	}

	async testContentIsObject() {
		var webRequest = new WebRequest(this.baseUrl+'content/object', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.body, '{"a":1,"b":2,"c":3}', 'body is correct');
		Assert.strictEqual(webRequestResponse.headers.get('Content-Type'), 'application/json', '"Content-Type" header is correct');
	}

	async testContentIsString() {
		var webRequest = new WebRequest(this.baseUrl+'content/string', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.body, 'Content is string.', 'body is correct');
	}

	async testContentIsBuffer() {
		var webRequest = new WebRequest(this.baseUrl+'content/buffer', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.body, 'Content is buffer.', 'body is correct');
	}

	async testContentIsStream() {
		var webRequest = new WebRequest(this.baseUrl+'content/stream', {});
		var webRequestResponse = await webRequest.execute();
		//app.log('webRequest', webRequest);
		//app.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.body, 'ABCDEFGHIJ', 'body is correct');
	}

	async testSingleRangeRequestsOnFile() {
		var rangesToTest = [
			{
				range: 'bytes=0-3',
				expectedBody: '0123',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 4,
				expectedContentRangeHeader: 'bytes 0-3/10',
				description: 'first 4 bytes using 0-3',
			},
			{
				range: 'bytes=4-7',
				expectedBody: '4567',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 4,
				expectedContentRangeHeader: 'bytes 4-7/10',
				description: 'second 4 bytes using 4-7',
			},
			{
				range: 'bytes=-4',
				expectedBody: '6789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 4,
				expectedContentRangeHeader: 'bytes 6-9/10',
				description: 'last 4 bytes using -4',
			},
			{
				range: 'bytes=7-',
				expectedBody: '789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 3,
				expectedContentRangeHeader: 'bytes 7-9/10',
				description: 'bytes 7 to the end using 7-',
			},
			{
				range: 'bytes=*',
				expectedBody: '0123456789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 10,
				expectedContentRangeHeader: 'bytes 0-9/10',
				description: 'all bytes using *',
			},
			{
				range: 'bytes=0-',
				expectedBody: '0123456789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 10,
				expectedContentRangeHeader: 'bytes 0-9/10',
				description: 'all bytes using 0-',
			},
		];

		await rangesToTest.each(async function(index, rangeToTest) {
			var webRequest = new WebRequest('http://localhost:8181/files/text/data.txt', {
				headers: {
					'Range': rangeToTest.range,
				},
			});
			var webRequestResponse = await webRequest.execute();

			//app.highlight(
			//	' webRequestResponse.statusCode', webRequestResponse.statusCode, "\n",
			//	'webRequestResponse.headers.get(\'Content-Range\')', webRequestResponse.headers.get('Content-Range'), "\n",
			//	'webRequestResponse.body', webRequestResponse.body
			//);

			Assert.equal(webRequestResponse.body, rangeToTest.expectedBody, 'Body for '+rangeToTest.description);
			Assert.equal(webRequestResponse.statusCode, rangeToTest.expectedStatusCode, 'Status code for '+rangeToTest.description);
			Assert.equal(webRequestResponse.headers.get('Content-Range'), rangeToTest.expectedContentRangeHeader, 'Content-Range for '+rangeToTest.description);
		});
	}

	// This is not implemented yet
	//async testMultipleRangeRequestsOnFile() {
	//	var rangesToTest = [
	//		{
	//			range: 'bytes=0-4,5-9',
	//			expectedBody: '0123456789',
	//			expectedStatusCode: 200,
	//			expectedContentLengthHeader: 10,
	//			expectedContentRangeHeader: 'bytes 0-4,5-9/10',
	//			description: 'all bytes using 0-4,5-9',
	//		},
	//		{
	//			range: 'bytes=0-4,-4',
	//			expectedBody: '012346789',
	//			expectedStatusCode: 206,
	//			expectedContentLengthHeader: 9,
	//			expectedContentRangeHeader: 'bytes 0-4,6-9/10',
	//			description: 'first 5 bytes and last 4 bytes using 0-4,-4',
	//		},
	//		{
	//			range: 'bytes=0-0,-1',
	//			expectedBody: '09',
	//			expectedStatusCode: 206,
	//			expectedContentLengthHeader: 2,
	//			expectedContentRangeHeader: 'bytes 0-0,9-9/10',
	//			description: 'first and last bytes only using 0-0,-1',
	//		},
	//		{
	//			range: 'bytes=0-0,4-4,-1',
	//			expectedBody: '049',
	//			expectedStatusCode: 206,
	//			expectedContentLengthHeader: 3,
	//			expectedContentRangeHeader: 'bytes 0-0,4-4,9-9/10',
	//			description: 'first, fifth, and last bytes only using 0-0,4-4,-4',
	//		},
	//		{
	//			range: 'bytes=2-4,6-8',
	//			expectedBody: '234678',
	//			expectedStatusCode: 206,
	//			expectedContentLengthHeader: 6,
	//			expectedContentRangeHeader: 'bytes 2-4,6-8/10',
	//			description: 'two ranges of bytes using 2-4,6-8',
	//		},
	//	];

	//	await rangesToTest.each(async function(index, rangeToTest) {
	//		var webRequest = new WebRequest('http://localhost:8181/files/text/data.txt', {
	//			headers: {
	//				'Range': rangeToTest.range,
	//			},
	//		});
	//		var webRequestResponse = await webRequest.execute();

	//		app.highlight(
	//			' webRequestResponse.statusCode', webRequestResponse.statusCode, "\n",
	//			'webRequestResponse.headers.get(\'Content-Range\')', webRequestResponse.headers.get('Content-Range'), "\n",
	//			'webRequestResponse.body', webRequestResponse.body
	//		);

	//		Assert.equal(webRequestResponse.body, rangeToTest.expectedBody, 'Body for '+rangeToTest.description);
	//		Assert.equal(webRequestResponse.statusCode, rangeToTest.expectedStatusCode, 'Status code for '+rangeToTest.description);
	//		Assert.equal(webRequestResponse.headers.get('Content-Range'), rangeToTest.expectedContentRangeHeader, 'Content-Range for '+rangeToTest.description);
	//	});
	//}

	async testSingleRangeRequestsOnFileSentWithGzipCompression() {
		var rangesToTest = [
			{
				range: 'bytes=0-3',
				expectedBody: '0123',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 4,
				expectedContentRangeHeader: 'bytes 0-3/10',
				description: 'first 4 bytes using 0-3',
			},
			{
				range: 'bytes=4-7',
				expectedBody: '4567',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 4,
				expectedContentRangeHeader: 'bytes 4-7/10',
				description: 'second 4 bytes using 4-7',
			},
			{
				range: 'bytes=-4',
				expectedBody: '6789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 4,
				expectedContentRangeHeader: 'bytes 6-9/10',
				description: 'last 4 bytes using -4',
			},
			{
				range: 'bytes=7-',
				expectedBody: '789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 3,
				expectedContentRangeHeader: 'bytes 7-9/10',
				description: 'bytes 7 to the end using 7-',
			},
			{
				range: 'bytes=*',
				expectedBody: '0123456789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 10,
				expectedContentRangeHeader: 'bytes 0-9/10',
				description: 'all bytes using *',
			},
			{
				range: 'bytes=0-',
				expectedBody: '0123456789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 10,
				expectedContentRangeHeader: 'bytes 0-9/10',
				description: 'all bytes using 0-',
			},
		];

		await rangesToTest.each(async function(index, rangeToTest) {
			var webRequest = new WebRequest('http://localhost:8181/files/text/data.txt', {
				headers: {
					'Accept-Encoding': 'gzip',
					'Range': rangeToTest.range,
				},
			});
			var webRequestResponse = await webRequest.execute();

			//app.highlight(
			//	' webRequestResponse.statusCode', webRequestResponse.statusCode, "\n",
			//	'webRequestResponse.headers.get(\'Content-Encoding\')', webRequestResponse.headers.get('Content-Encoding'), "\n",
			//	'webRequestResponse.headers.get(\'Content-Range\')', webRequestResponse.headers.get('Content-Range'), "\n",
			//	'webRequestResponse.body', webRequestResponse.body
			//);

			Assert.equal(webRequestResponse.body, rangeToTest.expectedBody, 'Body for '+rangeToTest.description);
			Assert.equal(webRequestResponse.statusCode, rangeToTest.expectedStatusCode, 'Status code for '+rangeToTest.description);
			Assert.equal(webRequestResponse.headers.get('Content-Range'), rangeToTest.expectedContentRangeHeader, 'Content-Range for '+rangeToTest.description);
			Assert.equal(webRequestResponse.headers.get('Content-Encoding'), 'gzip', 'Content-Encoding is gzip for '+rangeToTest.description);
		});
	}

	async testSingleRangeRequestsOnFileSentWithDeflateCompression() {
		var rangesToTest = [
			{
				range: 'bytes=0-3',
				expectedBody: '0123',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 4,
				expectedContentRangeHeader: 'bytes 0-3/10',
				description: 'first 4 bytes using 0-3',
			},
			{
				range: 'bytes=4-7',
				expectedBody: '4567',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 4,
				expectedContentRangeHeader: 'bytes 4-7/10',
				description: 'second 4 bytes using 4-7',
			},
			{
				range: 'bytes=-4',
				expectedBody: '6789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 4,
				expectedContentRangeHeader: 'bytes 6-9/10',
				description: 'last 4 bytes using -4',
			},
			{
				range: 'bytes=7-',
				expectedBody: '789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 3,
				expectedContentRangeHeader: 'bytes 7-9/10',
				description: 'bytes 7 to the end using 7-',
			},
			{
				range: 'bytes=*',
				expectedBody: '0123456789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 10,
				expectedContentRangeHeader: 'bytes 0-9/10',
				description: 'all bytes using *',
			},
			{
				range: 'bytes=0-',
				expectedBody: '0123456789',
				expectedStatusCode: 206,
				expectedContentLengthHeader: 10,
				expectedContentRangeHeader: 'bytes 0-9/10',
				description: 'all bytes using 0-',
			},
		];

		await rangesToTest.each(async function(index, rangeToTest) {
			var webRequest = new WebRequest('http://localhost:8181/files/text/data.txt', {
				headers: {
					'Accept-Encoding': 'deflate',
					'Range': rangeToTest.range,
				},
			});
			var webRequestResponse = await webRequest.execute();

			//app.highlight(
			//	' webRequestResponse.statusCode', webRequestResponse.statusCode, "\n",
			//	'webRequestResponse.headers.get(\'Content-Encoding\')', webRequestResponse.headers.get('Content-Encoding'), "\n",
			//	'webRequestResponse.headers.get(\'Content-Range\')', webRequestResponse.headers.get('Content-Range'), "\n",
			//	'webRequestResponse.body', webRequestResponse.body
			//);

			Assert.equal(webRequestResponse.body, rangeToTest.expectedBody, 'Body for '+rangeToTest.description);
			Assert.equal(webRequestResponse.statusCode, rangeToTest.expectedStatusCode, 'Status code for '+rangeToTest.description);
			Assert.equal(webRequestResponse.headers.get('Content-Range'), rangeToTest.expectedContentRangeHeader, 'Content-Range for '+rangeToTest.description);
			Assert.equal(webRequestResponse.headers.get('Content-Encoding'), 'deflate', 'Content-Encoding is deflate for '+rangeToTest.description);
		});
	}

	// This is not implemented yet
	//async testSingleRangeRequestsOnString() {
	//	var rangesToTest = [
	//		{
	//			range: 'bytes=0-3',
	//			expectedBody: '0123',
	//			expectedStatusCode: 206,
	//			expectedContentLengthHeader: 4,
	//			expectedContentRangeHeader: 'bytes 0-3/10',
	//			description: 'first 4 bytes using 0-3',
	//		},
	//		{
	//			range: 'bytes=4-7',
	//			expectedBody: '4567',
	//			expectedStatusCode: 206,
	//			expectedContentLengthHeader: 4,
	//			expectedContentRangeHeader: 'bytes 4-7/10',
	//			description: 'second 4 bytes using 4-7',
	//		},
	//		{
	//			range: 'bytes=-4',
	//			expectedBody: '6789',
	//			expectedStatusCode: 206,
	//			expectedContentLengthHeader: 4,
	//			expectedContentRangeHeader: 'bytes 6-9/10',
	//			description: 'last 4 bytes using -4',
	//		},
	//		{
	//			range: 'bytes=7-',
	//			expectedBody: '789',
	//			expectedStatusCode: 206,
	//			expectedContentLengthHeader: 3,
	//			expectedContentRangeHeader: 'bytes 7-9/10',
	//			description: 'bytes 7 to the end using 7-',
	//		},
	//		{
	//			range: 'bytes=*',
	//			expectedBody: '0123456789',
	//			expectedStatusCode: 206,
	//			expectedContentLengthHeader: 10,
	//			expectedContentRangeHeader: 'bytes 0-9/10',
	//			description: 'all bytes using *',
	//		},
	//		{
	//			range: 'bytes=0-',
	//			expectedBody: '0123456789',
	//			expectedStatusCode: 206,
	//			expectedContentLengthHeader: 10,
	//			expectedContentRangeHeader: 'bytes 0-9/10',
	//			description: 'all bytes using 0-',
	//		},
	//	];

	//	await rangesToTest.each(async function(index, rangeToTest) {
	//		var webRequest = new WebRequest('http://localhost:8181/api/data/numbers', {
	//			headers: {
	//				'Range': rangeToTest.range,
	//			},
	//		});
	//		var webRequestResponse = await webRequest.execute();

	//		//app.highlight(
	//		//	' webRequestResponse.statusCode', webRequestResponse.statusCode, "\n",
	//		//	'webRequestResponse.headers.get(\'Content-Encoding\')', webRequestResponse.headers.get('Content-Encoding'), "\n",
	//		//	'webRequestResponse.headers.get(\'Content-Range\')', webRequestResponse.headers.get('Content-Range'), "\n",
	//		//	'webRequestResponse.body', webRequestResponse.body
	//		//);

	//		Assert.equal(webRequestResponse.body, rangeToTest.expectedBody, 'Body for '+rangeToTest.description);
	//		Assert.equal(webRequestResponse.statusCode, rangeToTest.expectedStatusCode, 'Status code for '+rangeToTest.description);
	//		Assert.equal(webRequestResponse.headers.get('Content-Range'), rangeToTest.expectedContentRangeHeader, 'Content-Range for '+rangeToTest.description);
	//		Assert.equal(webRequestResponse.headers.get('Content-Encoding'), 'deflate', 'Content-Encoding is deflate for '+rangeToTest.description);
	//	});
	//}

}

// Export
export { WebServerTest };
