// Dependencies
import { Model } from '@framework/system/data/Model.js';
import { ModelProperty } from '@framework/system/data/ModelProperty.js';

// Class
class ModelClassManager {

	static addModelPropertyToModelClass(modelProperty, modelClass) {
		//app.log('modelProperty', modelProperty);
		//app.log('modelClass', modelClass);

		// Add the model property to properties
		//app.log('modelProperty.toSchema()', modelProperty.toSchema());
		var modelPropertySchema = modelProperty.toSchema();
		//app.log('modelPropertySchema', modelPropertySchema);
		modelClass.schema.properties[modelProperty.name] = modelPropertySchema;
		//app.log('modelClass.schema', modelClass.schema);

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
		}

		// Generate all of the the ModelProperty objects
		var modelProperties = [];
		schemaModel.properties.each(function(schemaModelPropertyIndex, schemaModelProperty) {
			modelProperties.append(ModelProperty.constructFromSchema(schemaModelProperty));
		});

		// Add the ModelProperty objects to the modelClass
		modelClass = ModelClassManager.addModelPropertiesToModelClass(modelProperties, modelClass);

		return modelClass;
	}

}

// Export
export { ModelClassManager };
