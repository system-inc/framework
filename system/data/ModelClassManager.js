// Dependencies
import Model from './../../system/data/Model.js';
import ModelProperty from './../../system/data/ModelProperty.js';

// Class
class ModelClassManager {

	static addModelPropertyToModelClass(modelProperty, modelClass) {
		// Add the model property to properties
		//console.log('modelClass.prototype.properties', modelClass.prototype.properties);
		//console.log('ModelClassManager - need to find the best way to change a class prototype after it has been created');
		console.log('I cant change the prototype here because of the way classes work, the construct method does everything and it will overwrite these changes'); 
		return modelClass;
		//return modelClass;
		//Node.exit();

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

	static addModelPropertiesToModelClass(modelProperties, modelClass) {
		modelProperties.each(function(modelPropertyIndex, modelProperty) {
			modelClass = ModelClassManager.addModelPropertyToModelClass(modelProperty, modelClass);
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
