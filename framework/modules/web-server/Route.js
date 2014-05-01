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
			var content = controller[this.methodName]();
			//console.log('Route.follow content:', content);

			// Make sure we have a string
			if(content && !content.isString()) {
				content = content.toString();
			}

			// Make sure we have content
			if(content) {
				this.response.content = content;	
			}
		}

		//console.log('Output', this.response.content);

		// Send the response
		this.response.send();
	},
	
});