// Dependencies
var Route = Framework.require('system/web-server/routes/Route.js');
var InternalServerError = Framework.require('system/web-server/errors/InternalServerError.js');
var Url = Framework.require('system/web/Url.js');

// Class
var RedirectRoute = Route.extend({

	type: 'redirect',
	redirectStatusCode: null,
	redirectHost: null,
	redirectLocation: null,

	construct: function(settings, parent) {
		this.inheritProperty('redirectStatusCode', settings, parent);
		this.inheritProperty('redirectHost', settings, parent);
		this.inheritProperty('redirectLocation', settings, parent);

		this.super.apply(this, arguments);
	},

	follow: function*(request, response) {
		response.statusCode = this.redirectStatusCode;

		// If it is a host redirect
		if(this.redirectHost) {
			// Clone the request URL
			var url = new Url(request.url.input);

			// Replace the host with the desired host
			url.host = this.redirectHost;

			//Console.highlight('Redirecting to', url.getUrl());

			// Redirect the client to the URL with the new host
			response.headers.set('Location', url.getUrl());
		}
		// If it is a location redirect
		else if(this.redirectLocation) {
			// Redirect the client to specific location
			response.headers.set('Location', this.redirectLocation);
		}
		// If not configured properly
		else {
			throw new InternalServerError('No redirect host or location configured.');
		}

		// Send the response
		yield this.super.apply(this, arguments);
	},

});

// Export
module.exports = RedirectRoute;