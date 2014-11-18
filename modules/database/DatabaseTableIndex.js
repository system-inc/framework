DatabaseTableIndex = Class.extend({

	database: null,
	databaseName: null,

	table: null,
	tableName: null,

	name: null,

	unique: null,
	type: null,
	sequenceInIndex: null,
	packed: null,
	collation: null,
	cardinality: null,
	subPart: null,

	columns: [],
	
	comment: null,

	drop: function() {

	},

	reorderColumns: function() {

	},

	getSchema: function() {

	},

});