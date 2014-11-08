Controller = Class.extend({

	request: null,
	response: null,
	route: null,
	data: null,

	construct: function(request, response, route, data) {
		this.request = request !== undefined ? request : this.request;
		this.response = response !== undefined ? response : this.response;
		this.route = route !== undefined ? route : this.route;
		this.data = data !== undefined ? data : this.data;
	},

	getController: function(controllerName, request, response, route, data) {
		//Console.out(controllerName);
		var controller = null;

		// If we don't have the controller load it
		if(!global[controllerName]) {
			// Look in the project controllers directory
			var controllerPath = Project.directory+'controllers/'+controllerName+'.js';
			if(File.synchronous.exists(controllerPath)) {
				//Console.out('Controller '+controllerPath+' exists.');
				require(controllerPath);
			}
		}
		
		// Load the controller if we have it
		if(global[controllerName]) {
			//Console.out('Controller '+controllerName+' is loaded.');
			controller = new global[controllerName](request, response, route, data);
		}

		return controller;
	},
	
});

// Static methods
Controller.getController = Controller.prototype.getController;