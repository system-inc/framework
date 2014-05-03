Main = Controller.extend({

	main: function*(resolve) {
		console.log('Main this', this);
		//console.log('Request:', this.request.url);

		// Set the content
		this.response.content = this.request.toString();
		
		//console.log('--- !!! Main.main list:', list);
		//console.log('^ this should be the array of file system objects');

		//var response = String.random(1024 * 1);
		//var response = this.request.toString();
		var response = this.getList();
		response = 'test';
		return resolve(response);
	},

	getList: function*(resolve) {
		var list = Directory.list('/var/www/framework/project/controllers/');

		return resolve(list);
	},
	
});