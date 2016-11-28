// Dependencies
import Route from 'framework/system/server/web/routes/Route.js';
import InternalServerError from 'framework/system/server/web/errors/InternalServerError.js';
import Url from 'framework/system/web/Url.js';

// Class
class RedirectRoute extends Route {

	type = 'redirect';
	redirectStatusCode = null;
	redirectHost = null;
	redirectLocation = null;

	constructor(settings, parent) {
		super(...arguments);

		this.inheritProperty('redirectStatusCode', settings, parent);
		this.inheritProperty('redirectHost', settings, parent);
		this.inheritProperty('redirectLocation', settings, parent);
	}

	async follow(request, response) {
		response.statusCode = this.redirectStatusCode;

		// If it is a host redirect
		if(this.redirectHost) {
			// Clone the request URL
			var url = new Url(request.url.input);

			// Replace the host with the desired host
			url.host = this.redirectHost;

			//app.highlight('Redirecting to', url.getUrl());

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
		await super.follow(...arguments);
	}

}

// Export
export default RedirectRoute;
