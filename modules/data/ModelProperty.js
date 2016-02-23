// Class
var ModelProperty = Class.extend({

	name: null,
	description: '',
	type: null,
	typeOptions: {},
	default: null,
	required: null,
	key: null,

	value: null,
	previousValue: null,

	validationRules: [],

	construct: function(name) {
		this.name = name;
	},

	beforeValidate: function*() {
	},

	validate: function*() {
		yield this.beforeValidate();
		yield this.afterValidate();
	},

	afterValidate: function*() {
	},

	setValue: function(value) {
		// Don't do anything if the new value is the same as the current value
		if(value == this.value) {
			return;
		}

		this.previousValue = this.value;
		this.value = value;
	},

	isChanged: function() {
		var isChanged = false;

		if(this.value != this.previousValue) {
			isChanged = true;
		}

		return isChanged;
	},

});

// Static methods

ModelProperty.constructFromSchemaModelProperty = function(schemaModelProperty) {
	var modelProperty = new ModelProperty(schemaModelProperty.name);

	if(schemaModelProperty.description) {
		modelProperty.description = schemaModelProperty.description;
	}

	if(schemaModelProperty.type) {
		modelProperty.type = schemaModelProperty.type;
	}

	if(schemaModelProperty.typeOptions) {
		modelProperty.typeOptions = schemaModelProperty.typeOptions;
	}

	if(schemaModelProperty.default) {
		modelProperty.default = schemaModelProperty.default;
	}

	if(schemaModelProperty.required) {
		modelProperty.required = schemaModelProperty.required;
	}

	if(schemaModelProperty.key) {
		modelProperty.key = schemaModelProperty.key;
	}

	return modelProperty;
}

// Export
module.exports = ModelProperty;