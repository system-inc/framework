ModelManager = Class.extend({

});

// Static methods
ModelManager.addPropertyToModel = function(modelProperty, model) {
	Console.out(arguments);
	model.properties[modelProperty.name] = modelProperty;

	// Add the getter
	model['get'+modelProperty.name.capitalize()] = function() {
		return this.get(modelProperty.name);
	}

	// Add the setter
	model['set'+modelProperty.name.capitalize()] = function() {
		return this.set(modelProperty.name);
	}
}

ModelManager.addPropertiesToModel = function(properties, model) {
	properties.each(function(modelPropertyName, modelProperty) {
		ModelManager.addPropertyToModel(modelPropertyName, modelProperty);
	});
}