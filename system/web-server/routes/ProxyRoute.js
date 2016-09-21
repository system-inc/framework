// Dependencies
import Route './Route.js';
import Url './../../system/web/Url.js';
import WebRequest './../../system/web/WebRequest.js';

// Class
class ProxyRoute extends Route {

	type: 'proxy',
	proxyUrl: null,
	proxyHeaders: null,

	constructor(settings, parent) {
		super(...arguments);

		this.inheritProperty('proxyUrl', settings, parent);
		// Make sure we are working with a URL object
		if(this.proxyUrl) {
			this.proxyUrl = new Url(this.proxyUrl);
		}
		this.inheritProperty('proxyHeaders', settings, parent);
	}

	getFullProxyUrl(requestUrl) {
		//Console.highlight(requestUrl, this.proxyUrl);

		// Clone the proxyUrl from the route
		var fullProxyUrl = Object.clone(this.proxyUrl);

		// Set the path of the fullProxyUrl to be the request path
		fullProxyUrl.path = requestUrl.path;

		// Rebuild the fullProxyUrl
		fullProxyUrl.rebuild();

		return fullProxyUrl;
	}

	async follow(request, response) {
		// Build a web request for the proxy
		var fullProxyUrl = this.getFullProxyUrl(request.url);
		//Console.highlight(fullProxyUrl);

		// Use the headers from the request
		var requestHeaders = Object.clone(request.headers);
		requestHeaders.update('host', fullProxyUrl.host);
		//Console.highlight('requestHeaders', requestHeaders);

		// Create a web request
		var webRequest = new WebRequest(fullProxyUrl, {
			decode: false,
			headers: requestHeaders,
		});
		//Console.highlight(webRequest);

		// Execute the web request
		var webRequestResponse = await webRequest.execute();
		//Console.highlight('webRequestResponse', webRequestResponse);

		// Match the status code
		response.statusCode = webRequestResponse.statusCode;

		// Match the headers
		var responseHeaders = Object.clone(webRequestResponse.headers);

		// Set the headers
		response.headers = responseHeaders;
		//app.log(response.headers);
		
		// Set the content
		response.content = webRequestResponse.body;
		//app.log(content);

		// Send the response
		await super.follow.apply(this, arguments);
	}

}

// Export
export default ProxyRoute;
