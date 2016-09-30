// Dependencies
import IpAddress from './IpAddress.js';

// Class
class IpV6Address extends IpAddress {

	version = 6;

	constructor(address) {
		super();
		this.address = (address == undefined ? this.address : address);
	}
	
}

// Export
export default IpV6Address;
