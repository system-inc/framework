require('./Data');
require('./Schema');
require('./SchemaModel');
require('./SchemaModelProperty');
require('./Model');
require('./ModelProperty');
require('./ModelList');
require('./model-adapters/ModelAdapter');
require('./model-adapters/DatabaseModelAdapter');
require('./model-adapters/ApiModelAdapter');
require('./ModelClassManager');

DataModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.super(settings);
	},
	
});