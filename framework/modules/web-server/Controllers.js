Controllers = Class.extend({

	construct: function() {
	},

	getController: function(controllerName, request, response) {
		var controller = null;

		// If we don't have the controller load it
		if(!global[controllerName]) {
			// Look in the project controllers directory
			var controllerPath = Project.path+'controllers/'+controllerName;
			require(controllerPath);
		}
		
		// Load the controller if we have it
		if(global[controllerName]) {
			controller = new global[controllerName](request, response);
		}

		return controller;
	},
	
});

// Static methods
Controllers.getController = Controllers.prototype.getController;