// Class
var DatabaseTableRelationship = Class.extend({

	database: null,
	databaseName: null,

	table: null,
	tableName: null,

	name: null,

	column: null,

	referencedDatabase: null,
	referencedDatabaseName: null,
	referencedTable: null,
	referencedTableName: null,
	referencedColumn: null,
	referencedColumnName: null,
	
	onUpdate: null,
	onDelete: null,

	construct: function(name, table) {
		this.name = name;
		this.table = table;
		this.tableName = table.name;
		this.database = this.table.database;
		this.databaseName = this.table.database.name;
	},

	loadProperties: function*(properties, constraint) {
		if(properties === undefined) {
			var propertiesQuery = yield this.database.query('SELECT * FROM `information_schema`.`KEY_COLUMN_USAGE` WHERE `REFERENCED_TABLE_SCHEMA` = ? AND `TABLE_NAME` = ? AND `REFERENCED_TABLE_NAME` IS NOT NULL', [this.database.name, this.table.name]);
			properties = propertiesQuery.rows.getObjectWithKeyValue('constraintName', this.name);
		}

		if(constraint === undefined) {
			var constraintQuery = yield this.database.query('SELECT * FROM `information_schema`.`REFERENTIAL_CONSTRAINTS` WHERE `CONSTRAINT_SCHEMA` = ? AND `CONSTRAINT_NAME` = ?', [this.database.name, this.name]);
			constraint = constraintQuery.rows.getObjectWithKeyValue('constraintName', this.name);
		}

		this.column = properties.columnName;
		this.referencedDatabaseName = properties.referencedTableSchema;
		this.referencedTableName = properties.referencedTableName;
		this.referencedColumnName = properties.referencedColumnName;
		this.onUpdate = constraint.updateRule;
		this.onDelete = constraint.deleteRule;
	},

	drop: function() {

	},

	getSchema: function*() {
		var schema = {};

		schema.name = this.name;
		schema.column = this.column;
		schema.referencedDatabaseName = this.referencedDatabaseName;
		schema.referencedTableName = this.referencedTableName;
		schema.referencedColumnName = this.referencedColumnName;
		schema.onUpdate = this.onUpdate;
		schema.onDelete = this.onDelete;

		return schema.sort();
	},

});

// Export
module.exports = DatabaseTableRelationship;