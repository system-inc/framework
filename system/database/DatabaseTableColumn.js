// Class
class DatabaseTableColumn {

	database = null;
	databaseName = null;

	table = null;
	tableName = null;

	name = null;
	alias = null;

	dataType = null;
	dataLength = null;
	default = null;

	primaryKey = null;
	nullable = null;
	unsigned = null;
	autoIncrement = null;
	zeroFill = null;

	characterSet = null;
	collation = null;
	comment = null;

	constructor(name, table) {
		this.name = name;
		this.table = table;
		this.tableName = table.name;
		this.database = this.table.database;
		this.databaseName = this.table.database.name;
	}

	async loadProperties(properties) {
		if(properties === undefined) {
			var propertiesQuery = await this.database.query('SHOW FULL COLUMNS FROM `'+this.table.name+'`');
			properties = propertiesQuery.rows.getObjectWithKeyValue('field', this.name);
		}
		
		// Get the data type from the type
		this.dataType = properties.type.match(/^(\w+)/).first();

		// Get the data length from the type
		var dataLengthMatches = properties.type.match(/^.+?\((.+?)\)/);
		if(dataLengthMatches) {
			this.dataLength = dataLengthMatches.second();
		}
		else {
			this.dataLength = null;
		}
		
		this.default = properties.default;
		this.primaryKey = (properties.key.contains('pri') > 0);
		this.nullable = (properties.null.lowercase() == 'yes') ;
		this.unsigned = (properties.type.contains('unsigned') > 0);
		this.autoIncrement = (properties.extra.contains('auto_increment') > 0);
		this.zeroFill = (properties.type.contains('zerofill') > 0);
		this.collation = properties.collation;
		this.comment = properties.comment;

		// Load the character set if we don't have it
		if(properties.characterSet === undefined) {
	        // Get the character set
	        var characterSetQuery = await this.database.query('SELECT `CHARACTER_SET_NAME` FROM `information_schema`.`COLUMNS` WHERE `TABLE_SCHEMA` = ? AND `TABLE_NAME` = ? AND `COLUMN_NAME` = ?', [this.database.name, this.table.name, this.name]);
	        this.characterSet = characterSetQuery.rows.first().characterSetName;
		}
		else {
			this.characterSet = properties.characterSet;
		}
	}

	calculateOptimalDataType() {

	}

	async getSchema() {
		var schema = {};

		schema.name = this.name;
		schema.dataType = this.dataType;
		schema.dataLength = this.dataLength;
		schema.default = this.default;
		schema.primaryKey = this.primaryKey;
		schema.nullable = this.nullable;
		schema.unsigned = this.unsigned;
		schema.autoIncrement = this.autoIncrement;
		schema.zeroFill = this.zeroFill;
		schema.characterSet = this.characterSet;
		schema.collation = this.collation;
		schema.comment = this.comment;

		return schema;
	}

}

// Export
export default DatabaseTableColumn;
