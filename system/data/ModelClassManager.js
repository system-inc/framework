// Dependencies
import Model from './../../system/data/Model.js';
import ModelProperty from './../../system/data/ModelProperty.js';

// Class
class ModelClassManager {

	static addModelPropertyToModelClass(modelProperty, modelClass) {
		app.log('modelProperty', modelProperty);
		//app.log('modelClass', modelClass);

		// Add the model property to properties
		app.log('modelClass.prototype.properties', modelClass.prototype.properties);
		modelClass.prototype.properties[modelProperty.name] = modelProperty;
		app.log('modelClass.prototype.properties', modelClass.prototype.properties);
		
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

	static addModelPropertiesToModelClass(modelProperties, modelClass) {
		modelProperties.each(function(modelPropertyIndex, modelProperty) {
			ModelClassManager.addModelPropertyToModelClass(modelProperty, modelClass);
		});

		return modelClass;
	}

	static generateModelClassFromSchemaModel(schemaModel) {
		var modelClass = class extends Model {
			name = schemaModel.name;
		}

		// Generate all of the the ModelProperty objects
		var modelProperties = [];
		schemaModel.properties.each(function(schemaModelPropertyIndex, schemaModelProperty) {
			modelProperties.append(ModelProperty.constructFromSchemaModelProperty(schemaModelProperty));
		});

		// Add the ModelProperty objects to the modelClass
		modelClass = ModelClassManager.addModelPropertiesToModelClass(modelProperties, modelClass);

		return modelClass;
	}

}

// Export
export default ModelClassManager;
