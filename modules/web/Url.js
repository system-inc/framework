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

		var nodeUrl = Node.Url.parse(string, true);

		this.protocol = nodeUrl.protocol.replace(':', '');
		this.port = (nodeUrl.port == null ? 80 : nodeUrl.port.toNumber());
		this.host = nodeUrl.hostname;
		this.path = nodeUrl.pathname;
		this.query = nodeUrl.query;
		this.queryString = nodeUrl.search;
		this.hash = nodeUrl.hash;

		this.url = this.getUrl();
	},

	getUrl: function() {
		return this.protocol+'://'+this.host+(this.port != 80 ? ':'+this.port : '')+this.path+this.queryString+(this.hash ? '#'+this.hash : '');
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
Url.constructFromNodeRequest = Url.prototype.constructFromNodeRequest;