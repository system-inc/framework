Controller = Class.extend({

	construct: function(request, response) {
		this.request = request ? request : null;
		this.response = response ? response : null;
	},

	getController: function(controllerName, request, response) {
		//console.log(controllerName);
		var controller = null;

		// If we don't have the controller load it
		if(!global[controllerName]) {
			// Look in the project controllers directory
			var controllerPath = Project.path+'controllers/'+controllerName+'.js';
			if(File.synchronous.exists(controllerPath)) {
				//console.log('Controller '+controllerPath+' exists.');
				require(controllerPath);
			}
		}
		
		// Load the controller if we have it
		if(global[controllerName]) {
			//console.log('Controller '+controllerName+' is loaded.');
			controller = new global[controllerName](request, response);
		}

		return controller;
	},
	
});

// Static methods
Controller.getController = Controller.prototype.getController;