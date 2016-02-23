// Dependencies
var Controller = Framework.require('modules/web-server/Controller.js');

// Class
var Main = Controller.extend({

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