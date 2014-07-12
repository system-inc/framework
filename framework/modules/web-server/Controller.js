Controller = Class.extend({

	construct: function(request, response, route, data) {
		this.request = request ? request : null;
		this.response = response ? response : null;
		this.route = route ? route : null;
		this.data = data ? data : null;
	},

	getController: function(controllerName, request, response, route, data) {
		//Log.log(controllerName);
		var controller = null;

		// If we don't have the controller load it
		if(!global[controllerName]) {
			// Look in the project controllers directory
			var controllerPath = Project.path+'controllers/'+controllerName+'.js';
			if(File.synchronous.exists(controllerPath)) {
				//Log.log('Controller '+controllerPath+' exists.');
				require(controllerPath);
			}
		}
		
		// Load the controller if we have it
		if(global[controllerName]) {
			//Log.log('Controller '+controllerName+' is loaded.');
			controller = new global[controllerName](request, response, route, data);
		}

		return controller;
	},
	
});

// Static methods
Controller.getController = Controller.prototype.getController;