SchemaModelProperty = Class.extend({

	name: null,
	description: null,
	type: null,
	default: null,
	required: null,
	key: null,

	// Methods
	toModelProperty: function() {

	},

});

// Static methods
SchemaModelProperty.convertType = function(type) {
	var convertedType = type;

	if(type == 'int') {
		convertedType = 'integer';
	}

	return convertedType;
}