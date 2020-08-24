// Dependencies
import { DatabaseTableColumn } from '@framework/system/database/DatabaseTableColumn.js';
import { DatabaseTableIndex } from '@framework/system/database/DatabaseTableIndex.js';
import { DatabaseTableRelationship } from '@framework/system/database/DatabaseTableRelationship.js';
import { Version } from '@framework/system/version/Version.js';

// Class
class DatabaseTable {

	database = null;
	databaseName = null;

	name = null;
	alias = null;

	engine = null; // The storage engine.

	version = null; // The version number of the table's .frm file.

	rows = [];
	rowCount = null; // The number of rows. Some storage engines, such as MyISAM, store the exact count. For other storage engines, such as InnoDB, this value is an approximation, and may vary from the actual value by as much as 40 to 50%.
	rowFormat = null; // The row-storage format (fixed, dynamic, compressed, redundant, compact).
	
	averageRowSizeInBytes = null;

	dataSizeInBytes = null; // The length of the data file.
	maximumDataSizeInBytes = null; // The maximum length of the data file. This is the total number of bytes of data that can be stored in the table, given the data pointer size used.

	autoIncrement = null; // The next auto incremement value.

	indexSizeInBytes = null;

	freeDataSizeInBytes = null; // The number of allocated but unused bytes, the size of the database files compared to the data stored in the database files.

	sizeInBytes = null;

	timeCreated = null;
	timeUpdated = null;
	timeChecked = null; // When the table was last checked. Not all storage engines update this time, in which case the value is always NULL.

	checksum = null;

	createOptions = null; // Extra options used with CREATE TABLE. The original options supplied when CREATE TABLE is called are retained and the options reported here may differ from the active table settings and options.

	comment = null;

	characterSet = null;
	collation = null;

	columns = [];
	columnCount = [];
	indexes = [];
	relationships = [];

	constructor(name, database) {
		this.name = name;

		this.database = database;
		this.databaseName = database.name;
	}

	async loadProperties(properties, characterSet, columns, indexes, relationships) {
		if(!properties) {
			var propertiesQuery = await this.database.query('SHOW TABLE STATUS WHERE NAME = ?', this.name);
			properties = propertiesQuery.rows.first();
		}

		this.autoIncrement = properties.autoIncrement;
        this.averageRowSizeInBytes = properties.avgRowLength;
        this.timeChecked = properties.checkTime;
        this.checksum = properties.checksum;
        this.collation = properties.collation;
        this.comment = properties.comment;
        this.createOptions = properties.createOptions;
        this.timeCreated = properties.createTime;
        this.freeDataSizeInBytes = properties.dataFree;
        this.dataSizeInBytes = properties.dataLength;
        this.engine = properties.engine;
        this.indexSizeInBytes = properties.indexLength;
        this.maximumDataSizeInBytes = properties.maxDataLength;
        this.rowFormat = properties.rowFormat.lowercase();
        this.rowCount = properties.rows;
        this.timeUpdated = properties.updateTime;
        this.version = new Version(properties.version);

        // Get the character set if necessary
        if(!characterSet) {
	        var characterSetQuery = await this.database.query('SELECT `information_schema`.`COLLATION_CHARACTER_SET_APPLICABILITY`.`character_set_name` FROM `information_schema`.`TABLES`, `information_schema`.`COLLATION_CHARACTER_SET_APPLICABILITY` WHERE `information_schema`.`COLLATION_CHARACTER_SET_APPLICABILITY`.`collation_name` = `information_schema`.`TABLES`.`table_collation` AND `information_schema`.`TABLES`.`table_schema` = ? AND `information_schema`.`TABLES`.`table_name` = ?', [this.database.name, this.name]);
	        this.characterSet = characterSetQuery.rows.first().characterSetName;
        }
        else {
        	this.characterSet = characterSet;
        }

        // Load the columns if passed
    	if(columns) {
    		await this.loadColumns(columns);
    	}

    	// Load the indexes if passed
    	if(indexes) {
    		await this.loadIndexes(indexes);
    	}

    	// Load the relationships if passed
    	if(relationships) {
    		await this.loadRelationships(relationships);
    	}
	}

	async loadColumns(columns) {
		if(!columns) {
			columns = await this.database.query('SHOW FULL FIELDS FROM `'+this.name+'`');
			columns = columns.rows;
		}
		
		await columns.each(async function(index, row) {
			var column = new DatabaseTableColumn(row.field, this);
			await column.loadProperties(row);

			this.columns.append(column);
		}.bind(this));

		return this.columns;
	}

	async loadIndexes(indexes) {
		if(!indexes) {
			var indexes = await this.database.query('SHOW INDEXES FROM `'+this.name+'`');
			indexes = indexes.rows;
		}

		await indexes.each(async function(index, row) {
			// If we already have the index add the column
			var hasIndex = this.hasIndex(row.keyName);
			if(hasIndex) {
				hasIndex.columns.append(row.columnName);
			}
			// If we don't already have the index
			else {
				var index = new DatabaseTableIndex(row.keyName, this);
				await index.loadProperties(row);
				this.indexes.append(index);
			}
		}.bind(this));

		return this.indexes;
	}

	hasIndex(name) {
		var hasIndex = false;

		this.indexes.each(function(index, value) {
			if(value.name == name) {
				hasIndex = value;
				return false; // break
			}
		});

		return hasIndex;
	}

	async loadRelationships(relationships) {
		if(!relationships) {
			var relationships = await this.database.query('SELECT * FROM `information_schema`.`KEY_COLUMN_USAGE` WHERE `REFERENCED_TABLE_SCHEMA` = ? AND `TABLE_NAME` = ? AND `REFERENCED_TABLE_NAME` IS NOT NULL', [this.database.name, this.name]);
			relationships = relationships.rows;

			var constraints = await this.database.query('SELECT * FROM `information_schema`.`REFERENTIAL_CONSTRAINTS` WHERE `CONSTRAINT_SCHEMA` = ? AND `TABLE_NAME` = ?', [this.database.name, this.name]);
			relationships.each(function(index, row) {
				row.constraint = constraints.rows.getObjectWithKeyValue('constraintName', row.constraintName);
			});
		}
		
		await relationships.each(async function(index, row) {
			var relationship = new DatabaseTableRelationship(row.constraintName, this);

			await relationship.loadProperties(row, row.constraint);

			this.relationships.append(relationship);
		}.bind(this));

		return this.relationships;
	}

	search() {

	}

	rename() {

	}

	truncate() {

	}

	drop() {

	}

	reorderColumns() {

	}

	duplicate() {

	}

	calculateOptimalColumnDataTypes() {

	}

	findRedundantIndexes() {

	}

	toSql() {

	}

	async getSchema() {
		var schema = {};

		schema.name = this.name;
		schema.engine = this.engine;
		schema.rowFormat = this.rowFormat;
		schema.autoIncrement = this.autoIncrement;
		schema.createOptions = this.createOptions;
		schema.comment = this.comment;
		schema.characterSet = this.characterSet;
		schema.collation = this.collation;
		schema.columns = this.columns;
		schema.indexes = this.indexes;
		schema.relationships = this.relationships;

		// Load the columns
		//await this.loadColumns(); // Not necessary with bulk call

		// Set the columns
		schema.columns = [];
		await this.columns.each(async function(index, column) {
			var columnSchema = await column.getSchema();
			schema.columns.append(columnSchema);
		}.bind(this));

		// Load the indexes
		//await this.loadIndexes(); // Not necessary with bulk call

		// Set the indexes
		schema.indexes = [];
		await this.indexes.each(async function(indexIndex, index) {
			var indexSchema = await index.getSchema();
			schema.indexes.append(indexSchema);
		}.bind(this));

		// Load the relationships
		//await this.loadRelationships(); // Not necessary with bulk call

		// Set the relationships
		schema.relationships = [];
		await this.relationships.each(async function(index, relationship) {
			var relationshipSchema = await relationship.getSchema();
			schema.relationships.append(relationshipSchema);
		}.bind(this));

		return schema;
	}

}

// Export
export { DatabaseTable };
