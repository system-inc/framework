Module = Class.extend({

	construct: function() {
	},

	load: function(modules) {
		// If we have an array of modules
		if(Array.is(modules)) {
			for(var i = 0; i < modules.length; i++) {
				Module.initialize(modules[i]);
			}
		}
		// If we just have a module name
		else {
			Module.initialize(modules);
		}
	},

	initialize: function(moduleName) {
		// Get the module path
		var modulePath = __dirname.replaceLast('objects', 'modules')+'/'+moduleName.toDashes()+'/'+moduleName+'Module';
		console.log('Initializing', moduleName, modulePath);

		require(modulePath);
	},

});

// Static methods
Module.load = Module.prototype.load;
Module.initialize = Module.prototype.initialize;