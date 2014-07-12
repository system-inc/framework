Module = Class.extend({

	version: null,
	settings: null,

	construct: function() {
	},

	load: function(moduleNames) {
		// Make sure we are working with an array of module names
		if(!Array.is(moduleNames)) {
			moduleNames = [moduleNames];
		}
		
		// Load each module
		for(var i = 0; i < moduleNames.length; i++) {
			// Get the module path
			var moduleName = moduleNames[i];
			var modulePath = __dirname.replaceLast('objects', 'modules')+'/'+moduleName.toDashes()+'/'+moduleName+'Module';
			Log.log('Loading', moduleName.toSpaces(), 'module...');
			require(modulePath);
		}
	},

	initialize: function(moduleNames) {
	},

});

// Static methods
Module.load = Module.prototype.load;
Module.initialize = Module.prototype.initialize;