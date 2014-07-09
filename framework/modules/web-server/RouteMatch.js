RouteMatch = Class.extend({

	route: null,
	request: null,
	response: null,
	partial: false,
	complete: false,
	data: {},
	errors: [],

	setRequest: function(request) {
		this.request = request;
	},

	setResponse: function(response) {
		this.response = response;
	},

	finalizeRouteData: function() {
		var finalizedRouteData = {};

		// Go through each capture group named in the route and its parents and assign the proper key and value for the capture group name and its matches
		var count = 1;
		this.getCaptureGroupNames().each(function(captureGroupName) {
			finalizedRouteData[captureGroupName] = this.complete[count];
			count++;
		}, this);

		// Merge what we have so far with the route data
		finalizedRouteData = this.route.data.merge(finalizedRouteData);

		// Strip out all of the capture group integer keys
		finalizedRouteData.each(function(key, value) {
			if(key.isInteger()) {
				delete finalizedRouteData[key];
			}
		});

		// Sort the data by keys
		finalizedRouteData = finalizedRouteData.sort();

		this.data = finalizedRouteData;
	},

	getCaptureGroupNames: function() {
		var captureGroupNames = [];

		// Make a flattened array of the route and it's parents
		var routeArray = this.route.getParents();
		routeArray.push(this.route);

		routeArray.each(function(route) {
			route.data.each(function(dataKey, dataValue) {
				if(dataKey.isInteger()) {
					captureGroupNames.push(dataValue);
				}
			});
		});

		return captureGroupNames;
	},

	follow: function*() {
		// Finalize route data
		this.finalizeRouteData();

		// Setup a variable to store the content
		var content = null;

		// Try to get the controller
		var controller = Controller.getController(this.route.controllerName, this.request, this.response, this.route, this.data);

		// If the controller was found, invoke the method for the route
		if(controller) {
			content = yield controller[this.route.methodName]();
		}
		// Send a 404
		else {
			this.response.statusCode = 404;
			this.response.content = this.request.method+' '+this.request.url.path+' not found.';
			this.response.content += ' Controller '+this.route.controllerName+' with method '+this.route.methodName+' does not exist.';
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
	}

});