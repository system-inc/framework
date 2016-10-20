// Dependencies
import IpAddress from './IpAddress.js';

// Class
class IpV6Address extends IpAddress {

	version = 6;

	constructor(address) {
		super();

		if(address) {
			this.address = address;
		}
	}
	
}

// Export
export default IpV6Address;
