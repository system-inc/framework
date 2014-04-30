Route = Class.extend({

	construct: function() {
		this.request = null;
		this.response = null;

		this.controllerName = 'Main';
		this.methodName = 'main';
	},

	setRequest: function(request) {
		this.request = request;
	},

	setResponse: function(response) {
		this.response = response;
	},

	follow: function() {
		var controller = Controller.getController(this.controllerName, this.request, this.response);
		if(controller) {
			//this.response.content = controller[this.methodName]();
			controller[this.methodName]();
		}

		// Send the response
		this.response.send();
	},
	
});