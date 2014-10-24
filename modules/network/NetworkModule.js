require('./IpAddress');
require('./IpV4Address');
require('./IpV6Address');
require('./Network');

NetworkModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);
	},
	
});