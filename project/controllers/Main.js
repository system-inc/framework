Main = Controller.extend({

	main: function() {
		//console.log('this', this);
		//console.log('Request:', this.request.url);

		// Set the content
		//this.response.content = 'Hi';
		//this.response.content = this.request.toString();
		//this.response.content = String.random(1024 * 1);

		// var result = Function.run(function*(variable) {
		// 	var a = yield 1;
		// 	var b = yield 2;
		// 	var c = a + b;

		// 	console.log('variable:', variable);

		// 	return c;
		// }('heyyyyyyy! result should be 3'));
		// console.log('result:', result);
		// return;

		var list = Directory.list('/');
		console.log('--- !!! Main.main list:', list);
		console.log('                        ^ this should be the array of directories');

		//var response = String.random(1024 * 1);
		//var response = this.request.toString();
		var response = '';
		return response;
	},
	
});