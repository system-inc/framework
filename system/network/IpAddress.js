// Class
var IpAddress = Class.extend({

	address: null,
	version: null,

	toString: function() {
		return this.address;
	},

	//http://en.wikipedia.org/wiki/IP_address
	//http://docs.oracle.com/javase/7/docs/api/java/net/InetAddress.html
	
});

// Export
module.exports = IpAddress;