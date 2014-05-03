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

	follow: function*(route, resolve) {
		var self = route;

		var controller = Controller.getController(self.controllerName, self.request, self.response);
		if(controller) {
			var content = yield controller[self.methodName]();

			// Make sure we have a string
			if(content && !content.isString()) {
				content = content.toString();
			}
			console.log('Route.follow content:', content);

			// Make sure we have content
			if(content) {
				self.response.content = content;	
			}
		}

		//console.log('Output', self.response.content);

		// Send the response
		self.response.send();

		return resolve();
	},
	
});