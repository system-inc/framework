WebServerTest = Test.extend({

	webServer: null,

	before: function*() {
		this.webServer = new WebServer('test', {
			protocols: {
				http: {
					ports: [
						8181
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
	},

	testRangeRequests: function*() {
		var webRequest = new WebRequest('http://localhost:8181/files/lorem-ipsum.txt');
		var webRequestResponse = yield webRequest.execute();

		//Console.highlight(webRequestResponse);
	},

});