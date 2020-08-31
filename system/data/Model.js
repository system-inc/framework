// Dependencies
import { ModelProperty } from '@framework/system/data/ModelProperty.js';

// Class
class Model {

	name = null;
	properties = {};

	adapter = null;
	adapters = [];

	constructor(values) {
		// Construct the model from the schema (e.g., MyModel.schema)
		this.fromSchema(this.constructor.schema); // this.constructor references the model class definition

		if(values) {
			values.each(function(propertyName, propertyValue) {
				this.set(propertyName, propertyValue);
			}.bind(this));
		}
	}

	fromSchema(schema) {
		this.name = schema.name;

		// Create properties on the instance
		schema.properties.each(function(index, modelPropertySchema) {
			// Set the property on this.properties
			this.properties[modelPropertySchema.name] = ModelProperty.fromSchema(modelPropertySchema);

			// Add the getter
			this['get'+modelPropertySchema.name.capitalize()] = function() {
				return this.get(modelPropertySchema.name);
			}

			// Add the setter
			var setterKey = 'set'+modelPropertySchema.name.capitalize();
			this[setterKey] = function(value) {
				return this.set(modelPropertySchema.name, value);
			}

			// Set default values
			if(modelPropertySchema.defaultValue !== null) {
				this[setterKey](modelPropertySchema.defaultValue);
			}
		}.bind(this));
	}

	get(propertyName) {
		return this.properties[propertyName].value;
	}

	setPropertyValue(propertyName, propertyValue) {
		//app.log('Model setPropertyValue propertyName', propertyName, 'propertyValue', propertyValue);

		this.properties[propertyName].setValue(propertyValue);
	}

	set(valuesOrPropertyName, propertyValue) {
		// If valuesOrPropertyName is a string, then it is a propertyName
		if(String.is(valuesOrPropertyName)) {
			this.setPropertyValue(valuesOrPropertyName, propertyValue);
		}
		// Otherwise it is a hash of propertyName: propertyValue
		else {
			valuesOrPropertyName.each(function(propertyName, propertyValue) {
				this.setPropertyValue(propertyName, propertyValue)
			}.bind(this));
		}

		return this;
	}

	isChanged() {
		var isChanged = false;

		this.constructor.properties.each(function(propertyName, property) {
			if(property.isChanged()) {
				isChanged = true;

				return false; // break
			}
		}.bind(this));

		return isChanged;
	}

	async beforeSave() {
	}

	async save() {
		await this.beforeSave();

		await this.adapter.save(this);

		await this.afterSave();
	}

	async afterSave() {
	}

	async beforeDelete() {
	}

	async delete() {
		await this.beforeDelete();

		await this.adapter.delete(this);

		await this.afterDelete();
	}

	async afterDelete() {
	}

	async beforeValidate() {
	}

	async validate() {
		await this.beforeValidate();

		var validationErrors = [];
		await this.constructor.properties.each(async function(propertyName, property) {
			var validationError = await property.validate();

			if(validationError) {
				validationErrors.append(validationError);
			}
		});

		await this.afterValidate();

		return validationErrors;
	}

	async afterValidate() {
	}

	static schema = {
		name: null,
		properties: {},
	};
}

// Export
export { Model };
