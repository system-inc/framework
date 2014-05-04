Main = Controller.extend({

	main: function*() {
		//var response = yield Directory.list('/');
		var response = yield Directory.list('/var/www/framework/framework/modules/server/');

		return response;
	},
	
});