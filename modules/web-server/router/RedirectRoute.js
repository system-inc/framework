RedirectRoute = Route.extend({

	type: 'redirect',
	redirectStatusCode: null,
	redirectLocation: null,

	construct: function(redirectStatusCode, redirectLocation) {
		this.redirectStatusCode = (redirectStatusCode === undefined ? null : redirectStatusCode);
		this.redirectLocation = (redirectLocation === undefined ? null : redirectLocation);
	},

});