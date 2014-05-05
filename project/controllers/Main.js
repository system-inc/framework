Main = Controller.extend({

	main: function*() {
		//return this.request;

		//var webRequest = new WebRequest('http://cloudflare.server.home.kirkouimet.com/hi.html');
		var webRequest = new WebRequest('http://server.home.kirkouimet.com/');
		//var webRequest = new WebRequest('http://www.socwall.com/');
		var response = yield webRequest.execute();

		return response;
	},
	
});