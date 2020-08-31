// Class
class Url {

	url = null;
	protocol = null;
	host = null;
	port = null;
	path = null;
	query = null;
	queryString = null;
	fragment = null;
	input = null;

	constructor(string) {
		// Make sure we are working with a string
		if(string) {
			string = string.toString();	
		}

		this.input = string;
		this.parse(string);
	}

	parse(string) {
		if(!string) {
			return;
		}

		// If the string is a file path
		if(string.startsWith('/')) {
			string = 'file://'+string;
		}

		// TODO: Haven't tested this
		var whatwgUrl = new URL(string);

		// Fix URL parser
		if(whatwgUrl.host === null && whatwgUrl.path !== null) {
			whatwgUrl.host = whatwgUrl.hostname = whatwgUrl.path;
			whatwgUrl.path = whatwgUrl.pathname = '';
		}

		// Set the protocol
		if(!whatwgUrl.protocol) {
			this.protocol = 'http';
		}
		else {
			this.protocol = whatwgUrl.protocol.replace(':', '');	
		}
		
		// Set the port
		if(whatwgUrl.port == null) {
			if(this.protocol == 'http')	{
				this.port = 80;
			}
			else if(this.protocol == 'https')	{
				this.port = 443;
			}
		}
		else {
			this.port = whatwgUrl.port.toNumber();
		}

		// Set the host
		this.host = whatwgUrl.hostname;

		// Set the path
		this.path = whatwgUrl.pathname;

		// Set the query
		this.query = whatwgUrl.query;

		// Set the query string
		this.queryString = whatwgUrl.search;

		// Set the fragment
		if(whatwgUrl.hash) {
			this.fragment = whatwgUrl.hash.replaceFirst('#', '');	
		}

		// Set the complete URL
		this.url = this.getUrl();
	}

	getUrl() {
		// Protocol and host
		var url = this.protocol+'://'+(this.host ? this.host : '');

		// Port
		if(this.port && this.port != 80 && this.port != 443) {
			url += ':'+this.port;
		}		

		// Path
		url += this.path;

		// Query string
		if(this.queryString) {
			url += this.queryString;
		}

		// Fragment
		if(this.fragment) {
			url += '#'+this.fragment;
		}

		return url;
	}

	rebuild() {
		this.url = this.getUrl();
	}

	toString() {
		return this.getUrl();
	}

	setQueryParameter(key, value) {
		// TODO: Copy and pasted this code, can probably clean this up
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
	    this.constructor(baseUrl + '?' + newAdditionalUrl + rows_txt);
	}

	static is(value) {
		return Class.isInstance(value, Url);
	}

	static fromNodeRequest(nodeRequest) {
		//app.highlight('nodeRequest.url', nodeRequest.url, 'nodeRequest', nodeRequest); app.exit();

		var urlString = null;

		// If the URL in the Node request is a full URL
		if(nodeRequest.url.startsWith('http')) {
			urlString = nodeRequest.url;
		}
		// If the URL in the node request is a relative URL, construct a full URL
		else {
			let protocol = 'http';
			if(nodeRequest.connection.encrypted) {
				protocol = 'https';
			}
			urlString = protocol+'://'+nodeRequest.headers.host+nodeRequest.url;
		}

		return new Url(urlString);
	}

	static encode = encodeURIComponent;
	
	static decode = decodeURIComponent;

}

// Export
export { Url };
