// Class
var DatabaseTableIndex = Class.extend({

	database: null,
	databaseName: null,

	table: null,
	tableName: null,

	name: null,

	unique: null,
	type: null,
	//sequenceInIndex: null,
	packed: null,
	nullable: null,
	collation: null,
	cardinality: null,
	subPart: null,

	columns: [],
	
	comment: null,

	construct: function(name, table) {
		this.name = name;
		this.table = table;
		this.tableName = table.name;
		this.database = this.table.database;
		this.databaseName = this.table.database.name;
	},

	loadProperties: function*(properties) {
		if(properties === undefined) {
			var propertiesQuery = yield this.database.query('SHOW FULL COLUMNS FROM `'+this.table.name+'`');
			properties = propertiesQuery.rows.getObjectWithKeyValue('field', this.name);
		}

		//Node.exit(properties);
				
		this.unique = (properties.nonUnique === 0);
		this.type = properties.indexType;
		//this.sequenceInIndex = properties.seqInIndex;
		this.packed = properties.packed;
		this.nullable = properties.null;
		this.collation = properties.collation;
		this.cardinality = properties.cardinality;
		this.subPart = properties.subPart;
		this.columns = [properties.columnName];
		this.comment = properties.indexComment;
	},

	drop: function() {

	},

	reorderColumns: function() {

	},

	getSchema: function*() {
		var schema = {};

		schema.name = this.name;
		schema.unique = this.unique;
		schema.type = this.type;
		//schema.sequenceInIndex = this.sequenceInIndex;
		schema.packed = this.packed;
		schema.nullable = this.nullable;
		schema.collation = this.collation;
		schema.cardinality = this.cardinality;
		schema.subPart = this.subPart;
		schema.columns = this.columns;
		schema.comment = this.comment;

		return schema.sort();
	},

});

// Export
module.exports = DatabaseTableIndex;