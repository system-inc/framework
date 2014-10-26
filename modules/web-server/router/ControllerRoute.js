ControllerRoute = Route.extend({

	type: 'controller',
	controllerName: null,
	controllerMethodName: null,

	construct: function(controllerName, controllerMethodName) {
		this.controllerName = (controllerName === undefined ? null : controllerName);
		this.controllerMethodName = (controllerMethodName === undefined ? null : controllerMethodName);
	},

});