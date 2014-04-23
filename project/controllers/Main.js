Main = Controller.extend({

	construct: function(request, response) {
		this.request = request;
		this.response = response;
	},

	main: function() {
		// Set headers
		this.response.headers.create('Content-Type', 'application/json');

		// Add a cookie
		this.response.cookies.create('token', 'abcdefghijklmnopqrstuvwxyz');
		this.response.cookies.create('test', '1234567890');

		// Set the content
		this.response.content = 'Hey';
		//this.response.content = this.request.toString();

		// Kam says pass is the node response and then call response.end(); when I'm finished
		// OR MAKE EVERY CONTROLLER A PROMISE ITSELF
		// Database.query('SELECT * FROM users').then('finish'), function(error, result) {
		// });
		//return {'hey':'there'};
	},
	
});