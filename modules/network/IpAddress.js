IpAddress = Class.extend({

	address: null,
	version: null,

	construct: function(address) {
		if(address.contains(':')) {
			return new IpV6Address(address);
		}
		else {
			return new IpV4Address(address);
		}
	},

	//http://en.wikipedia.org/wiki/IP_address
	//http://docs.oracle.com/javase/7/docs/api/java/net/InetAddress.html
	
});