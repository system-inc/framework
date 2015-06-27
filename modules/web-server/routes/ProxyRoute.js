ProxyRoute = Route.extend({

	type: 'proxy',
	proxyUrl: null,
	proxyHeaders: null,

	construct: function() {
	},

	getFullProxyUrl: function(requestUrl) {
		//Console.highlight(requestUrl, this.proxyUrl);

		// Clone the proxyUrl from the route
		var fullProxyUrl = Object.clone(this.proxyUrl);

		// Set the path of the fullProxyUrl to be the request path
		fullProxyUrl.path = requestUrl.path;

		// Rebuild the fullProxyUrl
		fullProxyUrl.rebuild();

		return fullProxyUrl;
	},

});