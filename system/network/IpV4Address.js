// Dependencies
var IpAddress = Framework.require('system/network/IpAddress.js');

// Class
var IpV4Address = IpAddress.extend({

	version: 4,

	construct: function(address) {
		this.address = (address == undefined ? this.address : address);
	},

});

// Export
module.exports = IpV4Address;