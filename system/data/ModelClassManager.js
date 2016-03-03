// Dependencies
var Model = Framework.require('system/data/Model.js');
var ModelProperty = Framework.require('system/data/ModelProperty.js');

// Class
var ModelClassManager = {};

// Static methods

ModelClassManager.addModelPropertyToModelClass = function(modelProperty, modelClass) {
	// Add the model property to properties
	modelClass.prototype.properties[modelProperty.name] = modelProperty;
	
	// Add the getter
	modelClass.prototype['get'+modelProperty.name.capitalize()] = function() {
		return this.get(modelProperty.name);
	}

	// Add the setter
	modelClass.prototype['set'+modelProperty.name.capitalize()] = function(value) {
		return this.set(modelProperty.name, value);
	}

	return modelClass;
};

ModelClassManager.addModelPropertiesToModelClass = function(modelProperties, modelClass) {
	modelProperties.each(function(modelPropertyIndex, modelProperty) {
		modelClass = ModelClassManager.addModelPropertyToModelClass(modelProperty, modelClass);
	});

	return modelClass;
};

ModelClassManager.generateModelClassFromSchemaModel = function(schemaModel) {
	var modelClass = Model.extend({
		'name': schemaModel.name,
	});

	// Generate all of the the ModelProperty objects
	var modelProperties = [];
	schemaModel.properties.each(function(schemaModelPropertyIndex, schemaModelProperty) {
		modelProperties.push(ModelProperty.constructFromSchemaModelProperty(schemaModelProperty));
	});

	// Add the ModelProperty objects to the modelClass
	modelClass = ModelClassManager.addModelPropertiesToModelClass(modelProperties, modelClass);

	return modelClass;
};

// Export
module.exports = ModelClassManager;