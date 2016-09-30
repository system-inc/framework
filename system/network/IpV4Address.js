// Dependencies
import IpAddress from './IpAddress.js';

// Class
class IpV4Address extends IpAddress {

	version = 4;

	constructor(address) {
		super();
		this.address = (address == undefined ? this.address : address);
	}

}

// Export
export default IpV4Address;
