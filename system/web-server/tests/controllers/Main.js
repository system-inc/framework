// Dependencies
var WebServerController = Framework.require('system/web-server/WebServerController.js');

// Class
var Main = WebServerController.extend({

	main: function*() {
		return {
			request: this.request,
			response: this.response,
		};
	},

	apiDataNumbers: function*() {
		return '0123456789';
	},
	
});

// Export
module.exports = Main;