DatabaseTable = Class.extend({

	database: null,
	databaseName: null,

	name: null,
	alias: null,

	engine: null, // The storage engine.

	version: null, // The version number of the table's .frm file.

	rows: [],
	rowCount: null, // The number of rows. Some storage engines, such as MyISAM, store the exact count. For other storage engines, such as InnoDB, this value is an approximation, and may vary from the actual value by as much as 40 to 50%.
	rowFormat: null, // The row-storage format (fixed, dynamic, compressed, redundant, compact).
	
	averageRowSizeInBytes: null,

	dataSizeInBytes: null, // The length of the data file.
	maximumDataSizeInBytes: null, // The maximum length of the data file. This is the total number of bytes of data that can be stored in the table, given the data pointer size used.

	autoIncrement: null, // The next auto incremement value.

	indexSizeInBytes: null,

	freeDataSizeInBytes: null, // The number of allocated but unused bytes, the size of the database files compared to the data stored in the database files.

	sizeInBytes: null,

	timeCreated: null,
	timeUpdated: null,
	timeChecked: null, // When the table was last checked. Not all storage engines update this time, in which case the value is always NULL.

	checksum: null,	

	createOptions: null, // Extra options used with CREATE TABLE. The original options supplied when CREATE TABLE is called are retained and the options reported here may differ from the active table settings and options.

	comment: null,

	characterSet: null,
	collation: null,

	columns: [],
	columnCount: [],
	indexes: [],
	relationships: [],

	construct: function(name, database) {
		this.name = name;

		this.database = database;
		this.databaseName = database.name;
	},

	loadProperties: function*() {
		var propertiesQuery = yield this.database.query('SHOW TABLE STATUS WHERE NAME = ?', this.name);
		var properties = propertiesQuery.rows.first();

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
        this.engine = properties.engine.lowercase();
        this.indexSizeInBytes = properties.indexLength;
        this.maximumDataSizeInBytes = properties.maxDataLength;
        this.rowFormat = properties.rowFormat.lowercase();
        this.rowCount = properties.rows;
        this.timeUpdated = properties.updateTime;
        this.version = new Version(properties.version);

        // Get the character set
        var characterSetQuery = yield this.database.query('SELECT `information_schema`.`COLLATION_CHARACTER_SET_APPLICABILITY`.`character_set_name` FROM `information_schema`.`TABLES`, `information_schema`.`COLLATION_CHARACTER_SET_APPLICABILITY` WHERE `information_schema`.`COLLATION_CHARACTER_SET_APPLICABILITY`.`collation_name` = `information_schema`.`TABLES`.`table_collation` AND `information_schema`.`TABLES`.`table_schema` = ? AND `information_schema`.`TABLES`.`table_name` = ?', [this.database.name, this.name]);
        this.characterSet = characterSetQuery.rows.first().characterSetName;
	},

	loadColumns: function*() {
		var columns = [];

		var fullColumns = yield this.database.query('SHOW FULL FIELDS FROM `'+this.name+'`');
		yield fullColumns.rows.each(function*(index, value) {
			var column = new DatabaseTableColumn(value.field, this);
			yield column.loadProperties();

			columns.push(column);
		}, this);

		this.columns = columns;

		return this.columns;
	},

	search: function() {

	},

	rename: function() {

	},

	truncate: function() {

	},

	drop: function() {

	},

	reorderColumns: function() {

	},

	duplicate: function() {

	},

	calculateOptimalColumnDataTypes: function() {

	},

	findRedundantIndexes: function() {

	},

	toSql: function() {

	},

	getSchema: function*() {
		var schema = {};

		schema.name = this.name;
		schema.engine = this.engine;
		schema.rowFormat = this.rowFormat;
		schema.autoIncrement = this.autoIncrement;
		schema.checksum = this.checksum;
		schema.createOptions = this.createOptions;
		schema.comment = this.comment;
		schema.characterSet = this.characterSet;
		schema.collation = this.collation;
		schema.columns = this.columns;
		schema.indexes = this.indexes;
		schema.relationships = this.relationships;

		// Get the columns
		yield this.loadColumns();

		// Set the columns
		schema.columns = [];
		yield this.columns.each(function*(index, column) {
			var columnSchema = yield column.getSchema();
			schema.columns.push(columnSchema);
		}, this);

		return schema;
	},

});