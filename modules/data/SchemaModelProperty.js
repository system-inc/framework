SchemaModelProperty = Class.extend({

	name: null,
	description: '',
	type: null,
	typeOptions: {},
	default: null,
	required: null,
	key: null,

	// Methods
	toModelProperty: function() {

	},

});

// Static methods
SchemaModelProperty.getTypeFromMySqlSchema = function(dataType) {
	var type;

	// Boolean, stored as TINYINT(1)
	if(dataType == 'bool' || dataType == 'boolean') {
		type = 'boolean';
	}
	// Data, stored as LONGBLOB
	else if(dataType == 'tinyblob' || dataType == 'blob' || dataType == 'mediumblob' || dataType == 'longblob' || dataType == 'binary' || dataType == 'varbinary') {
		type = 'data';
	}
	// Date, stored as DATE
	else if(dataType == 'date') {
		type = 'date';
	}
	// Enumeration, stored as ENUM
	else if(dataType == 'enum') {
		type = 'enumeration';
	}
	// Integer, stored as BIGINT
	else if(dataType == 'int' || dataType == 'mediumint' || dataType == 'smallint' || dataType == 'tinyint' || dataType == 'bigint') {
		type = 'integer';
	}
	// Number, stored as DECIMAL(65,30) (65 total digits, 30 used for precision after the decimal)
	else if(dataType == 'decimal' || dataType == 'double' || dataType == 'float' || dataType == 'long') {
		type = 'number';
	}
	// String, stored as VARCHAR(length (128 by default)), MySQL automatically converts to *TEXT type based on the length passed in
	else if(dataType == 'varchar' || dataType == 'char' || dataType == 'text' || dataType == 'tinytext' || dataType == 'mediumtext' || dataType == 'longtext') {
		type = 'string';
	}
	// Time, stored as DATETIME
	else if(dataType == 'datetime' || dataType == 'time' || dataType == 'timestamp' || dataType == 'year') {
		type = 'time';
	}

	return type;
}

SchemaModelProperty.getTypeOptionsFromMySqlSchema = function(dataType, dataLength, autoIncrement, unsigned, zeroFill) {
	var typeOptions = {};

	// Boolean, stored as TINYINT(1)
	if(dataType == 'bool' || dataType == 'boolean') {
	}
	// Data, stored as LONGBLOB
	else if(dataType == 'tinyblob' || dataType == 'blob' || dataType == 'mediumblob' || dataType == 'longblob' || dataType == 'binary' || dataType == 'varbinary') {
	}
	// Date, stored as DATE
	else if(dataType == 'date') {
	}
	// Enumeration, stored as ENUM
	else if(dataType == 'enum') {
		// Handle enumeration values
		var enumerationValues = dataLength.split(',');
		enumerationValues.each(function(index, element) {
			enumerationValues[index] = element.trim('\'');
		});
		typeOptions.values = enumerationValues;
	}
	// Integer, stored as BIGINT
	else if(dataType == 'int' || dataType == 'mediumint' || dataType == 'smallint' || dataType == 'tinyint' || dataType == 'bigint') {
		if(autoIncrement) {
			typeOptions.increment = true;
		}

		if(unsigned) {
			typeOptions.unsigned = true;
		}
		if(zeroFill) {
			typeOptions.zeroFill = true;
		}
	}
	// Number, stored as DECIMAL(65,30) (65 total digits, 30 used for precision after the decimal)
	else if(dataType == 'decimal' || dataType == 'double' || dataType == 'float' || dataType == 'long') {
	}
	// String, stored as VARCHAR(length (128 by default)), MySQL automatically converts to *TEXT type based on the length passed in
	else if(dataType == 'varchar' || dataType == 'char' || dataType == 'text' || dataType == 'tinytext' || dataType == 'mediumtext' || dataType == 'longtext') {
		if(dataLength) {
			typeOptions.length = dataLength;
		}
	}
	// Time, stored as DATETIME
	else if(dataType == 'datetime' || dataType == 'time' || dataType == 'timestamp' || dataType == 'year') {
	}

	return typeOptions;
}