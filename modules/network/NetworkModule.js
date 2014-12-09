require('./IpAddress');
require('./IpV4Address');
require('./IpV6Address');
require('./Network');

NetworkModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.super(settings);
	},
	
});