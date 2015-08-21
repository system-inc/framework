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

	getController: function(controllerName, webServer, request, response, route, data) {
		//Console.out(controllerName);
		var controller = null;

		// Set the directory containing the controllers folder
		var directory = Project.directory;
		if(webServer) {
			directory = webServer.directory;
		}

		// If we don't have the controller load it
		if(!global[controllerName]) {
			// Look in the project controllers directory
			var controllerPath = directory+'controllers/'+controllerName+'.js';
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

	getView: function*(viewPath, data) {
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
		var viewFile = new File(Node.Path.join(Project.directory+'views', viewPath));
		//console.log('viewFile', viewFile);

		var viewFileExists = yield viewFile.exists();
		//console.log('viewFileExists', viewFileExists);

		// Throw if the view file does not exist
		if(!viewFileExists) {
			throw new Error('View '+viewPath+' does not exist.');
		}

		var response = null;

		// If the view is not .js, read the file
		if(viewFile.extension != 'js') {
			response = yield viewFile.read();
			response = response.toString();
			//console.log('response', response);
		}
		else {
			response = Framework.require(viewFile.path);
			//console.log('response', response)
		}

		return response;
	},
	
});

// Static methods
Controller.getController = Controller.prototype.getController;
Controller.getView = Controller.prototype.getView;