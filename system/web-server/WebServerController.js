// Dependencies
import ServerController from './../../system/server/ServerController.js';

// Class
class WebServerController extends ServerController {

	request = null;
	response = null;
	route = null;
	data = null;

	constructor(request, response, route) {
		super(...arguments);

		this.route = route;
		this.data = this.route.collectData(request);
	}

	static getControllerInstance(controllerName, request, response, route) {
		//app.highlight(controllerName);
		
		var controllerInstance = null;

		// Set the directory containing the controllers folder
		var directory = app.directory;
		if(request.webServer) {
			directory = request.webServer.directory;
		}

		// Load the controller class
		var controllerPath = Node.Path.join(directory, 'controllers', controllerName+'.js');
		var controllerClass = Framework.require(controllerPath);

		// Instantiate the controller
		controllerInstance = new controllerClass(request, response, route);

		return controllerInstance;
	}

	static async getView(viewPath, data) {
		// See if the viewPath ends in a valid extension
		var validExtensions = [
			'.html',
			'.json',
			'.js',
		];
		var endsWithValidExtension = false;
		validExtensions.each(function(index, extension) {
			if(viewPath.endsWith(extension)) {
				endsWithValidExtension = true;
				return false; // break
			}
		});

		// If the view path does not end with a valid extension, assume .js
		if(!endsWithValidExtension) {
			viewPath = viewPath+'.js';
		}

		// Create a file to reference the view
		var viewFile = new File(Node.Path.join(app.directory, 'views', viewPath));
		//app.log('viewFile', viewFile);

		var viewFileExists = await viewFile.exists();
		//app.log('viewFileExists', viewFileExists);

		// Throw if the view file does not exist
		if(!viewFileExists) {
			throw new Error('View '+viewPath+' does not exist.');
		}

		var response = null;

		// If the view is not .js, read the file
		if(viewFile.extension != 'js') {
			response = await viewFile.read();
			response = response.toString();
			//app.log('response', response);
		}
		else {
			response = Framework.require(viewFile.path);
			//app.log('response', response)
		}

		return response;
	}

}

// Export
export default WebServerController;
