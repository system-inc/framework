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

	parse: function(string) {
		if(!string) {
			return;
		}

		var nodeUrl = Node.Url.parse(string, true);

		// Fix Node's URL parser
		if(nodeUrl.host === null && nodeUrl.path !== null) {
			nodeUrl.host = nodeUrl.hostname = nodeUrl.path;
			nodeUrl.path = nodeUrl.pathname = '';
		}

		// Set the protocol
		if(!nodeUrl.protocol) {
			this.protocol = 'http';
		}
		else {
			this.protocol = nodeUrl.protocol.replace(':', '');	
		}
		
		// Set the port
		if(nodeUrl.port == null) {
			if(this.protocol == 'http')	{
				this.port = 80;
			}
			else if(this.protocol == 'https')	{
				this.port = 443;
			}
		}
		else {
			this.port = nodeUrl.port.toNumber();
		}

		// Set the host
		this.host = nodeUrl.hostname;

		// Set the path
		this.path = nodeUrl.pathname;

		// Set the query
		this.query = nodeUrl.query;

		// Set the query string
		this.queryString = nodeUrl.search;

		// Set the hash
		this.hash = nodeUrl.hash;

		// Set the complete URL
		this.url = this.getUrl();
	},

	getUrl: function() {
		return this.protocol+'://'+this.host+(this.port != 80 && this.port != 443 ? ':'+this.port : '')+this.path+this.queryString+(this.hash ? '#'+this.hash : '');
	},

	toString: function() {
		return this.getUrl();
	},

	setQueryParameter: function(key, value) {
		// Copy and pasted this code, can probably clean this up
		var newAdditionalUrl = '';
	    var tempArray = this.url.split('?');
	    var baseUrl = tempArray[0];
	    var additionalUrl = tempArray[1];
	    var temp = '';
	    if(additionalUrl) {
	        tempArray = additionalUrl.split('&');
	        for(var i = 0; i < tempArray.length; i++){
	            if(tempArray[i].split('=')[0] != key) {
	                newAdditionalUrl += temp + tempArray[i];
	                temp = '&';
	            }
	        }
	    }
	    var rows_txt = temp + '' + key + '=' + value ;
	    this.construct(baseUrl + '?' + newAdditionalUrl + rows_txt);
	},

});

// Static methods
Url.constructFromNodeRequest = function(nodeRequest) {
	var protocol = 'http';
	if(nodeRequest.connection.encrypted) {
		protocol = 'https';
	}

	var urlString = protocol+'://'+nodeRequest.headers.host+nodeRequest.url;

	return new Url(urlString);
}

Url.encode = encodeURIComponent;
Url.decode = decodeURIComponent;