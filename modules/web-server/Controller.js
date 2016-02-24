// Class
var Controller = Class.extend({

	request: null,
	response: null,
	route: null,
	data: null,

	construct: function(request, response, route) {
		this.request = request;
		this.response = response;
		this.route = route;
		this.data = this.route.collectData(request);
	},
	
});

// Static methods

Controller.getControllerInstance = function(controllerName, request, response, route) {
	Console.highlight(controllerName);
	
	var controller = null;

	// Set the directory containing the controllers folder
	var directory = Project.directory;
	if(request.webServer) {
		directory = request.webServer.directory;
	}

	// Load the controller class
	var controllerPath = Node.Path.join(directory, 'controllers', controllerName+'.js');
	var controllerClass = Framework.require(controllerPath);

	// Instantiate the controller
	controller = new controllerClass(request, response, route);

	return controller;
};

Controller.getView = function*(viewPath, data) {
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
	var viewFile = new File(Node.Path.join(Project.directory, 'views', viewPath));
	//Console.log('viewFile', viewFile);

	var viewFileExists = yield viewFile.exists();
	//Console.log('viewFileExists', viewFileExists);

	// Throw if the view file does not exist
	if(!viewFileExists) {
		throw new Error('View '+viewPath+' does not exist.');
	}

	var response = null;

	// If the view is not .js, read the file
	if(viewFile.extension != 'js') {
		response = yield viewFile.read();
		response = response.toString();
		//Console.log('response', response);
	}
	else {
		response = Framework.require(viewFile.path);
		//Console.log('response', response)
	}

	return response;
}.toPromise();

// Export
module.exports = Controller;