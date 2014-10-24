IpV6Address = IpAddress.extend({

	version: 6,

	construct: function(address) {
		this.address = (address == undefined ? this.address : address);
	},
	
});