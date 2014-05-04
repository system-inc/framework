Main = Controller.extend({

	main: function*() {
		var response = yield Directory.list('/123');

		return response;
	},
	
});