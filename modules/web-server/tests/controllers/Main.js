Main = Controller.extend({

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