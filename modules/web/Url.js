Url = Class.extend({

	url: null,
	protocol: null,
	host: null,
	port: null,
	path: null,
	query: null,
	queryString: null,
	hash: null,
	input: null,

	construct: function(string) {
		this.input = string;
		this.parse(string);	
	},

	constructFromNodeRequest: function(nodeRequest) {
		// Hard coded for http for now
		var urlString = 'http://'+nodeRequest.headers.host+nodeRequest.url;

		return new Url(urlString);
	},

	parse: function(string) {
		if(!string) {
			return;
		}

		var nodeUrl = NodeUrl.parse(string, true);

		this.protocol = nodeUrl.protocol.replace(':', '');
		this.port = (nodeUrl.port == null ? 80 : nodeUrl.port.toNumber());
		this.host = nodeUrl.hostname;
		this.path = nodeUrl.pathname;
		this.query = nodeUrl.query;
		this.queryString = nodeUrl.search;
		this.hash = nodeUrl.hash;

		this.url = this.protocol+'://'+this.host+(this.port != 80 ? ':'+this.port : '')+this.path+this.queryString+(this.hash ? '#'+this.hash : '');
	},

	getHostFromString: function(string) {

	},

	// var host = ( nodeRequest.headers.host.match(/:/g) ) ? nodeRequest.headers.host.slice( 0, nodeRequest.headers.host.indexOf(":") ) : nodeRequest.headers.host;
	// var port = ( nodeRequest.headers.host.match(/:/g) ) ? nodeRequest.headers.host.slice( 1, nodeRequest.headers.host.indexOf(":") ) : nodeRequest.headers.host;

	getTopLevelDomain: function() {
		return null;
	},

	getBaseDomain: function() {
		return null;
	},

});

// Static methods
Url.constructFromNodeRequest = Url.prototype.constructFromNodeRequest;