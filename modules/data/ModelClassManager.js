ModelClassManager = Class.extend({
});

// Static methods
ModelClassManager.addPropertyToModelClass = function(modelProperty, modelClass) {
	// Add the new property to properties
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
}

ModelClassManager.addPropertiesToModelClass = function(properties, modelClass) {
	properties.each(function(modelPropertyName, modelProperty) {
		modelClass = ModelClassManager.addPropertyToModelClass(modelProperty, modelClass);
	});

	return modelClass;
}