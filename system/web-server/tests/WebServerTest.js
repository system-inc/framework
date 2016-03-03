// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var WebServer = Framework.require('system/web-server/WebServer.js');
var WebRequest = Framework.require('system/web/WebRequest.js');

// Class
var WebServerTest = Test.extend({

	webServer: null,

	before: function*() {
		this.webServer = new WebServer('test', {
			verbose: false,
			directory: __dirname,
			protocols: {
				http: {
					ports: [
						8181,
					],
				}
			},
			router: {
				routes: [
					{
						expression: '/',
						type: 'controller,',
						controllerName: 'Main',
						controllerMethodName: 'main',
						children: [
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