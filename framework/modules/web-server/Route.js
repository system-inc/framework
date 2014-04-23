Route = Class.extend({

	construct: function() {
		this.request = null;
		this.response = null;

		this.controllerName = 'Main';
		this.functionName = 'main';
	},

	setRequest: function(request) {
		this.request = request;
	},

	setResponse: function(response) {
		this.response = response;
	},

	follow: function() {
		var controller = Controllers.getController(this.controllerName, this.request, this.response);
		if(controller) {
			controller[this.functionName]();
		}

		// Send the response
		this.response.send();
	},
	
});