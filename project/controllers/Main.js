Main = Controller.extend({

	main: function*() {
		//console.log('this', this);
		//console.log('Request:', this.request.url);

		// console.log('-------------------------------------');
		// console.log('running!');

		// Set headers
		//this.response.headers.create('Content-Type', 'text/html');

		// Add a cookie
		//this.response.cookies.create('token', 'abcdefghijklmnopqrstuvwxyz');
		//this.response.cookies.create('test', '1234567890');

		// Set the content
		//this.response.content = 'Hi';
		//this.response.content = this.request.toString();
		//this.response.content = String.random(1024 * 1);

		yield 'stop 1';
		yield 'stop 2';
		yield 'stop 3';
		yield 'stop 4';
		//var response = String.random(1024 * 1);
		var response = '';
		return response;
	},
	
});