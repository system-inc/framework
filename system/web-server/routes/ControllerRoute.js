// Dependencies
var Route = Framework.require('system/web-server/routes/Route.js');
var NotFoundError = Framework.require('system/web-server/errors/NotFoundError.js');
var Controller = Framework.require('system/web-server/Controller.js');

// Class
var ControllerRoute = Route.extend({

	type: 'controller',
	controllerName: null,
	controllerMethodName: null,

	construct: function(settings, parent) {
		this.super.apply(this, arguments);

		this.inheritProperty('controllerName', settings, parent);
		this.inheritProperty('controllerMethodName', settings, parent);
	},

	follow: function*(request, response) {
		// Try to get the controller
		var controller = Controller.getControllerInstance(this.controllerName, request, response, this);

		// If the controller was found, invoke the method for the route
		if(controller && controller[this.controllerMethodName]) {
			// Use a reflection technique to find the argument names of the controller method and build an arguments array to send in
			var controllerMethodArguments = [];
			var controllerMethodArgumentNames = controller[this.controllerMethodName].getParameters();

			controllerMethodArgumentNames.each(function(index, controllerMethodArgumentName) {
				if(controller.data[controllerMethodArgumentName]) {
					controllerMethodArguments.append(controller.data[controllerMethodArgumentName]);
				}
				else {
					controllerMethodArguments.append(undefined);
				}
			}.bind(this));

			// Invoke the controller method and pass in the arguments array
			response.content = yield controller[this.controllerMethodName].apply(controller, controllerMethodArguments);
		}
		// Send a 404
		else {
			throw new NotFoundError(request.method+' '+request.url.path+' not found. Controller "'+this.controllerName+'" with method "'+this.controllerMethodName+'" does not exist.');
		}

		// Send the response
		response.send();
	},

});

// Export
module.exports = ControllerRoute;