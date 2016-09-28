// Class
class Model {

	name = 'Model';

	defaults = {};
	properties = {};
	adapter = null;
	adapters = [];

	constructor(values) {
		this.defaults.each(function(propertyName, propertyValue) {
			this.set(propertyName, propertyValue);
		}.bind(this));

		if(values) {
			values.each(function(propertyName, propertyValue) {
				this.set(propertyName, propertyValue);
			}.bind(this));
		}
	}

	setPropertyValue(propertyName, propertyValue) {
		app.log('Model setPropertyValue propertyName', propertyName, 'propertyValue', propertyValue);
		app.log('this.properties', this.properties);
		app.log('this.properties.'+propertyName, this.properties[propertyName]);

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

	get(propertyName) {
		return this.properties[propertyName].value;
	}

	isChanged() {
		var isChanged = false;

		this.properties.each(function(propertyName, property) {
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
		await this.properties.each(async function(propertyName, property) {
			var validationError = await property.validate();

			if(validationError) {
				validationErrors.push(validationError);
			}
		});

		await this.afterValidate();

		return validationErrors;
	}

	async afterValidate() {
	}

}

// Export
export default Model;
