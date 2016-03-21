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
			cookieObjectKey2: ['d', 'e', 'f'],
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

	item: function() {
		return this.data;
	},

	relatedItem: function() {
		return this.data;
	},

	putOnly: function() {
		return 'This method is only invoked on requests using the PUT method.';
	},

	levelOne: function() {
		return this.data;
	},

	levelOneLevelTwo: function() {
		return this.data;
	},

	levelOneLevelTwoLevelThree: function() {
		return this.data;
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