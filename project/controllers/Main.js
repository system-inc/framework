Main = Controller.extend({

	main: function*() {
		//return this.request;

		//var response = yield new WebRequest('http://cloudflare.server.home.kirkouimet.com/hi.html').execute();
		//var response = yield new WebRequest('http://server.home.kirkouimet.com/').execute();
		//var response = yield new WebRequest('http://www.socwall.com').execute();
		//var response = yield new WebRequest('http://www.increase.com').execute();
		//var response = yield new WebRequest('http://localhost/').execute();
		//var response = yield Directory.list('/');
		//var response = yield String.random(1024 * 1, '01');
		//var response = this.request;
		//var response = yield Cryptography.random();
		var response = 'Main';

		return response;
	},

	contact: function() {
		return 'Contact';
	},

	legal: function() {
		return 'Legal';
	},

	legalTermsOfService: function() {
		return 'Legal - Terms of Service';
	},
	
});