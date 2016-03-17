// Dependencies
var WebServerController = Framework.require('system/web-server/WebServerController.js');
var InternalServerError = Framework.require('system/web-server/errors/InternalServerError.js');

// Class
var TestWebServerController = WebServerController.extend({

	root: function*() {
		return this.data.root;

		//return {
		//	request: this.request,
		//	response: this.response,
		//};
	},

	cookies: function() {
		this.response.cookies.set('testCookie1', 'testCookie1Value');
		this.response.cookies.set('testCookie2', {
			cookieObjectKey1: ['a', 'b', 'c'],
		});
		//Console.warn(this.response.headers);
		//Console.warn(this.response.cookies);

		return 'Route with cookies.';
	},

	throwInternalServerErrorInFunction: function() {
		throw new InternalServerError('Internal Server Error thrown in function.');
	},

	throwInternalServerErrorInGenerator: function*() {
		throw new InternalServerError('Internal Server Error thrown in generator.');
	},

	apiHelloWorld: function() {
		return {
			data: {
				message: 'Hello world.',
			},
		};
	},

	apiDataNumbers: function*() {
		return '0123456789';
	},
	
});

// Export
module.exports = TestWebServerController;