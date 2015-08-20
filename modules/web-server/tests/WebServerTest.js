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
		var webRequest = new WebRequest('http://localhost:8181/files/text/numbers.txt', {
			
		});
		var webRequestResponse = yield webRequest.execute();

		//Console.highlight(webRequestResponse.body);
	},

});