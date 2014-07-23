require('./IpAddress');
require('./Ipv4Address');
require('./Ipv6Address');
require('./Network');

NetworkModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);
	},
	
});