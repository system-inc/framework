// Class
class ModelProperty {

	name = null;
	description = '';
	type = null;
	typeOptions = {};
	defaultValue = null;
	required = null;
	key = null;

	value = null;
	previousValue = null;

	validationRules = [];

	constructor(name) {
		this.name = name;
	}

	async beforeValidate() {
	}

	async validate() {
		await this.beforeValidate();
		await this.afterValidate();
	}

	async afterValidate() {
	}

	setValue(value) {
		// Don't do anything if the new value is the same as the current value
		if(value == this.value) {
			return;
		}

		this.previousValue = this.value;
		this.value = value;
	}

	isChanged() {
		var isChanged = false;

		if(this.value != this.previousValue) {
			isChanged = true;
		}

		return isChanged;
	}

	toSchema() {
		var schema = {
			name: this.name,
			description: this.description,
			type: this.type,
			typeOptions: this.typeOptions,
			defaultValue: this.defaultValue,
			required: this.required,
			key: this.key,
		};

		return schema;
	}

	static constructFromSchema(schemaModelProperty) {
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

		if(schemaModelProperty.defaultValue) {
			modelProperty.defaultValue = schemaModelProperty.defaultValue;
		}

		if(schemaModelProperty.required) {
			modelProperty.required = schemaModelProperty.required;
		}

		if(schemaModelProperty.key) {
			modelProperty.key = schemaModelProperty.key;
		}

		return modelProperty;
	}

}

// Export
export { ModelProperty };
