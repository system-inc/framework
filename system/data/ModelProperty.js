// Class
class ModelProperty {

	name = null;
	description = '';
	type = null;
	typeOptions = {};
	default = null;
	required = null;
	key = null;

	value = null;
	previousValue = null;

	validationRules = [];

	construct(name) {
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

	static constructFromSchemaModelProperty(schemaModelProperty) {
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

}

// Export
export default ModelProperty;
