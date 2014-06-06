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
		var response = this.request.method+' '+this.request.url.path+' ('+this.route.controllerName+'.'+this.route.methodName+')';
		response += "\nData:\n"+Json.encode(this.route.data);

		return response;
	},

	contact: function() {
		var response = this.request.method+' '+this.request.url.path+' ('+this.route.controllerName+'.'+this.route.methodName+')';
		response += "\nData:\n"+Json.encode(this.route.data);

		return response;
	},

	legal: function() {
		var response = this.request.method+' '+this.request.url.path+' ('+this.route.controllerName+'.'+this.route.methodName+')';
		response += "\nData:\n"+Json.encode(this.route.data);

		return response;
	},

	legalTermsOfService: function() {
		var response = this.request.method+' '+this.request.url.path+' ('+this.route.controllerName+'.'+this.route.methodName+')';
		response += "\nData:\n"+Json.encode(this.route.data);

		return response;
	},
	
});