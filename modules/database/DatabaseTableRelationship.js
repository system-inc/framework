DatabaseTableRelationship = Class.extend({

	database: null,
	databaseName: null,

	table: null,
	tableName: null,

	name: null,

	columns: [],

	referencedDatabase: null,
	referencedTable: null,
	referencedColumns: [],
	
	onUpdate: null,
	onDelete: null,

	drop: function() {

	},

	getSchema: function() {

	},

});