import IpV4Address from 'framework/system/network/IpV4Address.js';
import IpV6Address from 'framework/system/network/IpV6Address.js';

// Class
class IpAddressFactory {

	static create(address) {
		var ipAddress = null;

		if(address.contains(':')) {
			ipAddress = new IpV6Address(address);
		}
		else {
			ipAddress = new IpV4Address(address);
		}

		return ipAddress;
	}

}

// Export
export default IpAddressFactory;
