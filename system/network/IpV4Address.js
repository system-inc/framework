// Dependencies
import IpAddress from 'framework/system/network/IpAddress.js';

// Class
class IpV4Address extends IpAddress {

	version = 4;

	constructor(address) {
		super();

		if(address) {
			this.address = address;
		}
	}

}

// Export
export default IpV4Address;
