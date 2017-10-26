// Class
class IpAddress {

	// TODO: Integrate this stuff: https://github.com/indutny/node-ip

	address = null;
	version = null;

	toString() {
		return this.address;
	}

	static create(address) {
		var ipAddress = null;

		if(address.contains(':')) {
			var IpV6Address = require('framework/system/network/IpV6Address.js').default;
			ipAddress = new IpV6Address(address);
		}
		else {
			var IpV4Address = require('framework/system/network/IpV4Address.js').default;
			ipAddress = new IpV4Address(address);
		}

		return ipAddress;
	}

	//http://en.wikipedia.org/wiki/IP_address
	//http://docs.oracle.com/javase/7/docs/api/java/net/InetAddress.html
	
}

// Export
export default IpAddress;
