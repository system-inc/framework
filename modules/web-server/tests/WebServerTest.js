WebServerTest = Test.extend({

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
						type: 'file',
						expression: '(.*)',
					},
				],
			},
		});

		yield this.webServer.start();
	},

	after: function*() {
		yield this.webServer.stop();
	},

	testRangeRequests: function*() {
		// Block the test which will allow me to run requests in the browser against the web server
		//yield Function.delay(1000 * 60 * 60);

		var rangesToTest = [
			//{
			//	range: 'bytes=0-3',
			//	description: 'First 4 bytes',
			//	expected: '0123',
			//},
			//{
			//	range: 'bytes=4-7',
			//	description: 'Second 4 bytes',
			//	expected: '4567',
			//},
			//{
			//	range: 'bytes=-4',
			//	description: 'Last 4 bytes',
			//	expected: '6789',
			//},
			//{
			//	range: 'bytes=0-4,-4',
			//	description: 'First 5 bytes and last 4 bytes',
			//	expected: '6789',
			//},
			//{
			//	range: 'bytes=7-',
			//	description: 'Bytes 7 to the end',
			//	expected: '789',
			//},
			//{
			//	range: 'bytes=0-0,-1',
			//	description: 'First and last bytes only',
			//	expected: '09',
			//},
			//{
			//	range: 'bytes=0-0,4-4,-1',
			//	description: 'First, fifth, and last bytes only',
			//	expected: '049',
			//},
			//{
			//	range: 'bytes=2-4,6-8',
			//	description: 'Two ranges of bytes',
			//	expected: '234678',
			//},
			//{
			//	range: 'bytes=*',
			//	description: 'All bytes',
			//	expected: '0123456789',
			//},
		];

		//yield rangesToTest.each(function*(index, rangeToTest) {
		//	var webRequest = new WebRequest('http://localhost:8181/files/text/data.txt', {
		//		headers: {
		//			'Range': rangeToTest.range,
		//		},
		//	});
		//	var webRequestResponse = yield webRequest.execute();

		//	Console.highlight('webRequestResponse.body', webRequestResponse.body);

		//	Assert.equal(webRequestResponse.body, rangeToTest.expected, rangeToTest.description);
		//});
	},

});