Request = Class.extend({

	construct: function(nodeRequest) {
		this.url = new Url.constructFromNodeRequest(nodeRequest);
		this.method = nodeRequest.method;
		this.headers = nodeRequest.headers;
		this.ip = nodeRequest.connection.remoteAddress;
		this.httpVersion = {
			'version': nodeRequest.httpVersion,
			'major': nodeRequest.httpVersionMajor,
			'minor': nodeRequest.httpVersionMinor,
		}

		var userAgent = this.getHeader('user-agent');
		this.browser = new Browser.constructFromUserAgent(userAgent);
		this.device = new Device.constructFromUserAgent(userAgent);
		this.operatingSystem = new OperatingSystem.constructFromUserAgent(userAgent);
	},

	getHeader: function(name) {
		var header = false;

		for(var key in this.headers) {
			if(key.toLowerCase() == name.toLowerCase()) {
				header = this.headers[key];
				break;
			}
		}

		return header;
	}
	
});