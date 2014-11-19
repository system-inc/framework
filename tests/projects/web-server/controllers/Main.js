Main = Controller.extend({

	main: function*() {
		//throw new InternalServerError('main!');

		//yield Function.delay(500);

		//return this.request;

		//Console.highlight(this.route.hosts);
		
		var frameworkTestDatabase = new Database({
			host: 'localhost',
			username: 'framework_test',
			password: 'framework_test',
			databaseName: 'framework_test',
		});
		var response = yield frameworkTestDatabase.query('SELECT * FROM `user`');
		//var response = yield frameworkTestDatabase.getSchema();
		return response;

		//return String.random(1024 * 1, '01');

		return this.request;

		//var response = 'hey';
		//var response = Json.encode(badWebRequest);
		//var response = yield new WebRequest('http://cloudflare.server.home.kirkouimet.com/hi.html').execute();
		//var response = yield new WebRequest('http://server.home.kirkouimet.com/').execute();
		//var response = Json.encode(yield new WebRequest('http://www.socwall.com').execute());
		//var response = Json.encode(yield new WebRequest('http://www.increase.com').execute());
		//var response = yield new WebRequest('http://localhost/').execute();
		//var response = Json.encode(yield Directory.list('/var/www/'));
		//Console.out(response);
		//var response = Json.encode(yield Directory.list('/var/www/framework/project/views/images/'));
		//var response = yield String.random(1024 * 1, '01');
		//var response = Json.encode(this.request);
		//var response = yield Cryptography.random();
		//var response = this.request.method+' '+this.request.url.path+' ('+this.route.controllerName+'.'+this.route.controllerMethodName+')';
		//response += "\nData:\n"+Json.encode(this.data);

		return response;
	},

	contact: function() {
		//throw new NotFoundError('oops!');

		var response = this.request.method+' '+this.request.url.path+' ('+this.route.controllerName+'.'+this.route.controllerMethodName+')';
		response += "\nData:\n"+Json.encode(this.data);

		return response;
	},

	legal: function() {
		var response = this.request.method+' '+this.request.url.path+' ('+this.route.controllerName+'.'+this.route.controllerMethodName+')';
		response += "\nData:\n"+Json.encode(this.data);

		return response;
	},

	legalTermsOfService: function() {
		var response = this.request.method+' '+this.request.url.path+' ('+this.route.controllerName+'.'+this.route.controllerMethodName+')';
		response += "\nData:\n"+Json.encode(this.data);

		return response;
	},

	legalTermsOfServiceIOs: function() {
		var response = this.request.method+' '+this.request.url.path+' ('+this.route.controllerName+'.'+this.route.controllerMethodName+')';
		response += "\nData:\n"+Json.encode(this.data);

		return response;
	},
	
});