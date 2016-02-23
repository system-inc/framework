// Class
var IpAddressFactory = {};

// Static methods

IpAddressFactory.create = function(address) {
	var ipAddress = null;

	if(address.contains(':')) {
		var IpV6Address = Framework.require('modules/network/IpV6Address.js');
		ipAddress = new IpV6Address(address);
	}
	else {
		var IpV4Address = Framework.require('modules/network/IpV4Address.js');
		ipAddress = new IpV4Address(address);
	}

	return ipAddress;
};

// Export
module.exports = IpAddressFactory;