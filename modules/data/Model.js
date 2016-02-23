// Class
var Model = Class.extend({

	name: 'Model',

	defaults: {},
	properties: {},
	adapter: null,
	adapters: [],

	construct: function(values) {
		this.defaults.each(function(propertyName, propertyValue) {
			this.set(propertyName, propertyValue);
		}.bind(this));

		if(values) {
			values.each(function(propertyName, propertyValue) {
				this.set(propertyName, propertyValue);
			}.bind(this));
		}
	},

	setPropertyValue: function(propertyName, propertyValue) {
		this.properties[propertyName].setValue(propertyValue);
	},

	set: function(valuesOrPropertyName, propertyValue) {
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
	},

	get: function(propertyName) {
		return this.properties[propertyName].value;
	},

	isChanged: function() {
		var isChanged = false;

		this.properties.each(function(propertyName, property) {
			if(property.isChanged()) {
				isChanged = true;

				return false; // break
			}
		}.bind(this));

		return isChanged;
	},

	beforeSave: function*() {
	},

	save: function*() {
		yield this.beforeSave();

		yield this.adapter.save(this);

		yield this.afterSave();
	},

	afterSave: function*() {
	},

	beforeDelete: function*() {
	},

	delete: function*() {
		yield this.beforeDelete();

		yield this.adapter.delete(this);

		yield this.afterDelete();
	},

	afterDelete: function*() {
	},

	beforeValidate: function*() {
	},

	validate: function*() {
		yield this.beforeValidate();

		var validationErrors = [];
		yield this.properties.each(function*(propertyName, property) {
			var validationError = yield property.validate();

			if(validationError) {
				validationErrors.push(validationError);
			}
		});

		yield this.afterValidate();

		return validationErrors;
	},

	afterValidate: function*() {
	},

});

// Export
module.exports = Model;