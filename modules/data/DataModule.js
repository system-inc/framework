require('./Data');
require('./Schema');
require('./Model');
require('./ModelProperty');
require('./ModelList');
require('./model-adapters/ModelAdapter');
require('./model-adapters/DatabaseModelAdapter');
require('./model-adapters/ApiModelAdapter');
require('./ModelClassManager');

DataModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);
	},
	
});