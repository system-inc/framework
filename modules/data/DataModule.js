DataModule = Module.extend({

	version: new Version('0.1.0'),

	dependencies: [
		'Data',
		'Schema',
		'SchemaModel',
		'SchemaModelProperty',
		'Model',
		'ModelProperty',
		'ModelList',
		'model-adapters/ModelAdapter',
		'model-adapters/DatabaseModelAdapter',
		'model-adapters/ApiModelAdapter',
		'ModelClassManager',
	],
	
});