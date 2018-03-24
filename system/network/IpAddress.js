// Class
class IpAddress {

	// TODO: Integrate this stuff: https://github.com/indutny/node-ip

	address = null;
	version = null;

	toString() {
		return this.address;
	}

	static async create(address) {
		var ipAddress = null;

		if(address.contains(':')) {
			const IpV6Address = (await import('framework/system/network/IpV6Address.js')).default;
			ipAddress = new IpV6Address(address);
		}
		else {
			const IpV4Address = (await import('framework/system/network/IpV4Address.js')).default;
			ipAddress = new IpV4Address(address);
		}

		return ipAddress;
	}

	//http://en.wikipedia.org/wiki/IP_address
	//http://docs.oracle.com/javase/7/docs/api/java/net/InetAddress.html
	
}

// Export
export default IpAddress;
