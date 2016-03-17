// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var WebServer = Framework.require('system/web-server/WebServer.js');
var WebRequest = Framework.require('system/web/WebRequest.js');
var Url = Framework.require('system/web/Url.js');

// Class
var WebServerTest = Test.extend({

	protocol: 'http',
	host: 'localhost',
	port: 8181,
	baseUrl: null,
	webServer: null,

	before: function*() {
		this.baseUrl = new Url(this.protocol+'://'+this.host+':'+this.port);

		this.webServer = new WebServer('test', {
			verbose: false,
			directory: __dirname,
			protocols: {
				http: {
					ports: [
						this.port,
					],
				}
			},
			router: {
				routes: [
					{
						expression: '/',
						type: 'controller,',
						controllerName: 'TestWebServerController',
						controllerMethodName: 'root',
						data: {
							root: 'Root data.',
						},
						children: [
							{
								expression: 'cookies',
								controllerMethodName: 'cookies',
							},
							{
								expression: 'throw-internal-server-error-in-function',
								controllerMethodName: 'throwInternalServerErrorInFunction',
							},
							{
								expression: 'throw-internal-server-error-in-generator',
								controllerMethodName: 'throwInternalServerErrorInGenerator',
							},
							{
								type: 'redirect',
								redirectStatusCode: 301,
								redirectHost: 'http://www.system.inc/',
								expression: 'redirect',
							},
							{
								type: 'proxy',
								proxyUrl: 'http://www.system.inc/',
								expression: 'proxy',
							},
							{
								expression: 'users/(\\w+?)/?',
								data: {
									view: 'user',
									1: 'username',
								},
								description: 'Users!',
								children: [
									{
										expression: 'story/(\\w+?)/?',
										data: {
											view: 'userStory',
											1: 'story',
										},
									},
								],
							},
							{
								methods: 'PUT',
								controllerMethodName: 'main',
								expression: 'put-only',
								data: {
									view: 'putOnly',
								},
							},
							{
								controllerMethodName: 'contact',
								expression: 'contact',
								data: {
									contactData: 'contact!',
									view: 'contact',
								},
							},
							{
								controllerMethodName: 'legal',
								expression: 'legal/?',
								data: {
									legalData: 'legal',
									view: 'legal',
								},
								children: [
									{
										controllerMethodName: 'legalTermsOfService',
										expression: 'terms-of-service/?',
										data: {
											legalTermsOfServiceData: 'legalTermsOfService',
											view: 'legalTermsOfService',
										},
										children: [
											{
												controllerMethodName: 'legalTermsOfServiceIOs',
												expression: 'ios/?',
												data: {
													legalTermsOfServiceIOsData: 'legalTermsOfServiceIOs',
													view: 'legalTermsOfServiceIOs',
												},
											},
										],
									},
								],
							},
							{
								expression: 'api/data/numbers',
								controllerMethodName: 'apiDataNumbers',
							},
							{
								expression: '(.*?)(images|scripts|styles|files)/(.*)',
								type: 'file',
								filePath: '*',
							},
						],
					},
				],
			},
		});

		//Console.highlight(this.webServer);

		yield this.webServer.start();

		// Block the test which will allow me to run requests in the browser against the web server
		//yield Function.delay(1000 * 60 * 60);
	},

	after: function*() {
		yield this.webServer.stop();
	},

	// Controller Route for Main.main() - /
	testRootRoute: function*() {
		var webRequest = new WebRequest(this.baseUrl, {});
		var webRequestResponse = yield webRequest.execute();
		//Console.log('webRequest', webRequest);
		//Console.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 200, 'Response for Controller Route (/): statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'OK', 'Response for Controller Route (/): statusMessage is correct');
		Assert.strictEqual(webRequestResponse.body, 'Root data.', 'Response for Controller Route (/): body is correct');
		Assert.strictEqual(webRequestResponse.data, null, 'Response for Controller Route (/): data is correct');
		Assert.false(webRequestResponse.headers.getHeader('content-type'), 'Response for Controller Route (/): "Content-Type" header is not set');
		Assert.false(webRequestResponse.headers.getHeader('content-disposition'), 'Response for Controller Route (/): "Content-Disposition" header is not set');
		Assert.false(webRequestResponse.headers.getHeader('last-modified'), 'Response for Controller Route (/): "Last-Modified" header is set');
		Assert.false(webRequestResponse.headers.getHeader('etag'), 'Response for Controller Route (/): "ETag" header is set');
		Assert.false(webRequestResponse.headers.getHeader('accept-ranges'), 'Response for Controller Route (/): "Accept-Ranges" header is not set');
		Assert.equal(webRequestResponse.headers.getHeader('content-encoding'), 'gzip', 'Response for Controller Route (/): "Content-Encoding" header is correct');
		Assert.true(webRequestResponse.headers.getHeader('x-processing-time-in-milliseconds'), 'Response for Controller Route (/): "X-Processing-Time-in-Milliseconds" header is set');
		Assert.true(webRequestResponse.headers.getHeader('x-response-id'), 'Response for Controller Route (/): "X-Response-Id" header is set');
		Assert.true(webRequestResponse.headers.getHeader('date'), 'Response for Controller Route (/): "Date" header is set');
		Assert.equal(webRequestResponse.headers.getHeader('connection'), 'close', 'Response for Controller Route (/): "Connection" header is correct');
		Assert.equal(webRequestResponse.headers.getHeader('transfer-encoding'), 'chunked', 'Response for Controller Route (/): "Transfer-Encoding" header is correct');
	},

	// File Route for .txt File - /files/text/data.txt;
	testFileRouteForTextFile: function*() {
		var webRequest = new WebRequest(this.baseUrl+'files/text/data.txt', {});
		var webRequestResponse = yield webRequest.execute();
		//Console.log('webRequest', webRequest);
		//Console.info('webRequestResponse', webRequestResponse);
		
		Assert.strictEqual(webRequestResponse.statusCode, 200, 'Response for File Route (data.txt): statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'OK', 'Response for File Route (data.txt): statusMessage is correct');
		Assert.strictEqual(webRequestResponse.body, '0123456789', 'Response for File Route (data.txt): body is correct');
		Assert.strictEqual(webRequestResponse.data, null, 'Response for File Route (data.txt): data is correct');
		Assert.equal(webRequestResponse.headers.getHeader('content-type'), 'text/plain', 'Response for File Route (data.txt): "Content-Type" header is correct');
		Assert.equal(webRequestResponse.headers.getHeader('content-disposition'), 'inline; filename="data.txt"', 'Response for File Route (data.txt): "Content-Disposition" header is correct');
		Assert.true(webRequestResponse.headers.getHeader('last-modified'), 'Response for File Route (data.txt): "Last-Modified" header is set');
		Assert.true(webRequestResponse.headers.getHeader('etag'), 'Response for File Route (data.txt): "ETag" header is set');
		Assert.equal(webRequestResponse.headers.getHeader('accept-ranges'), 'bytes', 'Response for File Route (data.txt): "Accept-Ranges" header is correct');
		Assert.equal(webRequestResponse.headers.getHeader('content-encoding'), 'gzip', 'Response for File Route (data.txt): "Content-Encoding" header is correct');
		Assert.true(webRequestResponse.headers.getHeader('x-processing-time-in-milliseconds'), 'Response for File Route (data.txt): "X-Processing-Time-in-Milliseconds" header is set');
		Assert.true(webRequestResponse.headers.getHeader('x-response-id'), 'Response for File Route (data.txt): "X-Response-Id" header is set');
		Assert.true(webRequestResponse.headers.getHeader('date'), 'Response for File Route (data.txt): "Date" header is set');
		Assert.equal(webRequestResponse.headers.getHeader('connection'), 'close', 'Response for File Route (data.txt): "Connection" header is correct');
		Assert.equal(webRequestResponse.headers.getHeader('transfer-encoding'), 'chunked', 'Response for File Route (data.txt): "Transfer-Encoding" header is correct');
	},

	testControllerRouteWithCookies: function*() {
		var webRequest = new WebRequest(this.baseUrl+'cookies', {});
		var webRequestResponse = yield webRequest.execute();
		//Console.log('webRequest', webRequest);
		//Console.info('webRequestResponse', webRequestResponse);

		Assert.equal(webRequestResponse.cookies.get('testCookie1'), 'testCookie1Value', 'Response for Controller Route with Cookies (/cookies): First "Set-Cookie" header is correct');
		Assert.equal(webRequestResponse.cookies.get('testCookie2'), '{\"cookieObjectKey1\":[\"a\",\"b\",\"c\"]}', 'Response for Controller Route with Cookies (/cookies): Second "Set-Cookie" header is correct');
	},

	testUnmatchedRoute: function*() {
		var webRequest = new WebRequest(this.baseUrl+'404', {});
		var webRequestResponse = yield webRequest.execute();
		//Console.log('webRequest', webRequest);
		//Console.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 404, 'Response for unmatched route: statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Not Found', 'Response for unmatched route: statusMessage is correct');
	},

	testRouteThrowsInternalServerErrorInFunction: function*() {
		var webRequest = new WebRequest(this.baseUrl+'throw-internal-server-error-in-function', {});
		var webRequestResponse = yield webRequest.execute();
		//Console.log('webRequest', webRequest);
		//Console.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 500, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Internal Server Error', 'statusMessage is correct');
		Assert.strictEqual(webRequestResponse.data.errors.first().message, 'Internal Server Error thrown in function.', 'Error message is correct');
	},

	testRouteThrowsInternalServerErrorInGenerator: function*() {
		var webRequest = new WebRequest(this.baseUrl+'throw-internal-server-error-in-generator', {});
		var webRequestResponse = yield webRequest.execute();
		//Console.log('webRequest', webRequest);
		//Console.info('webRequestResponse', webRequestResponse);

		Assert.strictEqual(webRequestResponse.statusCode, 500, 'statusCode is correct');
		Assert.strictEqual(webRequestResponse.statusMessage, 'Internal Server Error', 'statusMessage is correct');
		Assert.strictEqual(webRequestResponse.data.errors.first().message, 'Internal Server Error thrown in generator.', 'Error message is correct');
	},

	testNoGzipEncoding: function() {

	},

	//test all routes above

	testSingleRangeRequestsOnFile: function*() {
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

		yield rangesToTest.each(function*(index, rangeToTest) {
			var webRequest = new WebRequest('http://localhost:8181/files/text/data.txt', {
				headers: {
					'Range': rangeToTest.range,
				},
			});
			var webRequestResponse = yield webRequest.execute();

			//Console.highlight(
			//	' webRequestResponse.statusCode', webRequestResponse.statusCode, "\n",
			//	'webRequestResponse.headers.get(\'Content-Range\')', webRequestResponse.headers.get('Content-Range'), "\n",
			//	'webRequestResponse.body', webRequestResponse.body
			//);

			Assert.equal(webRequestResponse.body, rangeToTest.expectedBody, 'Body for '+rangeToTest.description);
			Assert.equal(webRequestResponse.statusCode, rangeToTest.expectedStatusCode, 'Status code for '+rangeToTest.description);
			Assert.equal(webRequestResponse.headers.get('Content-Range'), rangeToTest.expectedContentRangeHeader, 'Content-Range for '+rangeToTest.description);
		});
	},

	// This is not implemented yet
	//testMultipleRangeRequestsOnFile: function*() {
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

	//	yield rangesToTest.each(function*(index, rangeToTest) {
	//		var webRequest = new WebRequest('http://localhost:8181/files/text/data.txt', {
	//			headers: {
	//				'Range': rangeToTest.range,
	//			},
	//		});
	//		var webRequestResponse = yield webRequest.execute();

	//		Console.highlight(
	//			' webRequestResponse.statusCode', webRequestResponse.statusCode, "\n",
	//			'webRequestResponse.headers.get(\'Content-Range\')', webRequestResponse.headers.get('Content-Range'), "\n",
	//			'webRequestResponse.body', webRequestResponse.body
	//		);

	//		Assert.equal(webRequestResponse.body, rangeToTest.expectedBody, 'Body for '+rangeToTest.description);
	//		Assert.equal(webRequestResponse.statusCode, rangeToTest.expectedStatusCode, 'Status code for '+rangeToTest.description);
	//		Assert.equal(webRequestResponse.headers.get('Content-Range'), rangeToTest.expectedContentRangeHeader, 'Content-Range for '+rangeToTest.description);
	//	});
	//},

	testSingleRangeRequestsOnFileSentWithGzipCompression: function*() {
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

		yield rangesToTest.each(function*(index, rangeToTest) {
			var webRequest = new WebRequest('http://localhost:8181/files/text/data.txt', {
				headers: {
					'Accept-Encoding': 'gzip',
					'Range': rangeToTest.range,
				},
			});
			var webRequestResponse = yield webRequest.execute();

			//Console.highlight(
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
	},

	testSingleRangeRequestsOnFileSentWithDeflateCompression: function*() {
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

		yield rangesToTest.each(function*(index, rangeToTest) {
			var webRequest = new WebRequest('http://localhost:8181/files/text/data.txt', {
				headers: {
					'Accept-Encoding': 'deflate',
					'Range': rangeToTest.range,
				},
			});
			var webRequestResponse = yield webRequest.execute();

			//Console.highlight(
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
	},

	// This is not implemented yet
	//testSingleRangeRequestsOnString: function*() {
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

	//	yield rangesToTest.each(function*(index, rangeToTest) {
	//		var webRequest = new WebRequest('http://localhost:8181/api/data/numbers', {
	//			headers: {
	//				'Range': rangeToTest.range,
	//			},
	//		});
	//		var webRequestResponse = yield webRequest.execute();

	//		//Console.highlight(
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
	//},

});

// Export
module.exports = WebServerTest;