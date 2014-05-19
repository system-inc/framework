Route = Class.extend({

	construct: function() {
		this.request = null;
		this.response = null;

		this.expression = null;

		// this.controllerName = null;
		// this.methodName = null;

		this.controllerName = 'Main';
		this.methodName = 'main';
	},

	setRequest: function(request) {
		this.request = request;
	},

	setResponse: function(response) {
		this.response = response;
	},

	follow: function*() {
		// Setup a variable to store the content
		var content = null;

		// Try to get the controller
		var controller = Controller.getController(this.controllerName, this.request, this.response);

		// If the controller was found, invoke the method for the route
		if(controller) {
			content = yield controller[this.methodName]();
		}
		// Send a 404
		else {
			this.response.statusCode = 404;
		}

		// If content exists, make sure it is a string
		if(content && !content.isString()) {
			content = content.toString();
		}

		// If content exists, put it on the response
		if(content) {
			this.response.content = content;
		}

		// Send the response
		//console.log('Sending response:', this.response.id, this.response.content);
		this.response.send();
	},
	
});