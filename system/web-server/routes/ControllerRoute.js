// Dependencies
import Route from './Route.js';
import NotFoundError from './../errors/NotFoundError.js';
import WebServerController from './../WebServerController.js';

// Class
class ControllerRoute extends Route {

	type = 'controller';
	controllerName = null;
	controllerMethodName = null;

	constructor(settings, parent) {
		super(...arguments);

		this.inheritProperty('controllerName', settings, parent);
		this.inheritProperty('controllerMethodName', settings, parent);

		//Console.info('ControllerRoute.construct', 'settings', settings, 'parent', parent);
	}

	async follow(request, response) {
		// Try to get the controller
		var controller = WebServerController.getControllerInstance(this.controllerName, request, response, this);

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
			response.content = await controller[this.controllerMethodName].apply(controller, controllerMethodArguments);
		}
		// Send a 404
		else {
			throw new NotFoundError(request.method+' '+request.url.path+' not found. Controller "'+this.controllerName+'" with method "'+this.controllerMethodName+'" does not exist.');
		}

		// Send the response
		await this.super.apply(this, arguments);
	}

}

// Export
export default ControllerRoute;
