// Dependencies
var IpAddress = Framework.require('system/network/IpAddress.js');

// Class
var IpV6Address = IpAddress.extend({

	version: 6,

	construct: function(address) {
		this.address = (address == undefined ? this.address : address);
	},
	
});

// Export
module.exports = IpV6Address;