IpV4Address = IpAddress.extend({

	version: 4,

	construct: function(address) {
		this.address = (address == undefined ? this.address : address);
	},

});