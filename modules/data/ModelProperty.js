ModelProperty = Class.extend({

	name: null,
	value: null,
	previousValue: null,
	description: '',
	
	isChanged: null,
	isNew: null,

	// WHAT TYPES DO I WANT TO SUPPORT?
	type: undefined, // Supported types 'integer', 'time', 'date', 'string', 'boolean'

	// USE THIS?
	length: null,

	// USE THIS?
	required: null,

	// ADD all the data type stuff from SCHEMA

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

	beforeChange: function*() {
	},

	setValue: function(value) {
		//yield this.beforeChange();

		this.previousValue = this.value;
		this.value = value;

		if(this.previousValue != this.value) {
			this.isChanged = true;
		}		

		//yield this.afterChange();
	},

	afterChange: function*() {
	},

});