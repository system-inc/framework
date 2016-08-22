// Class
class DatabaseTableRelationship {

	database = null;
	databaseName = null;

	table = null;
	tableName = null;

	name = null;

	column = null;

	referencedDatabase = null;
	referencedDatabaseName = null;
	referencedTable = null;
	referencedTableName = null;
	referencedColumn = null;
	referencedColumnName = null;
	
	onUpdate = null;
	onDelete = null;

	constructor(name, table) {
		this.name = name;
		this.table = table;
		this.tableName = table.name;
		this.database = this.table.database;
		this.databaseName = this.table.database.name;
	}

	async loadProperties(properties, constraint) {
		if(properties === undefined) {
			var propertiesQuery = await this.database.query('SELECT * FROM `information_schema`.`KEY_COLUMN_USAGE` WHERE `REFERENCED_TABLE_SCHEMA` = ? AND `TABLE_NAME` = ? AND `REFERENCED_TABLE_NAME` IS NOT NULL', [this.database.name, this.table.name]);
			properties = propertiesQuery.rows.getObjectWithKeyValue('constraintName', this.name);
		}

		if(constraint === undefined) {
			var constraintQuery = await this.database.query('SELECT * FROM `information_schema`.`REFERENTIAL_CONSTRAINTS` WHERE `CONSTRAINT_SCHEMA` = ? AND `CONSTRAINT_NAME` = ?', [this.database.name, this.name]);
			constraint = constraintQuery.rows.getObjectWithKeyValue('constraintName', this.name);
		}

		this.column = properties.columnName;
		this.referencedDatabaseName = properties.referencedTableSchema;
		this.referencedTableName = properties.referencedTableName;
		this.referencedColumnName = properties.referencedColumnName;
		this.onUpdate = constraint.updateRule;
		this.onDelete = constraint.deleteRule;
	}

	drop() {

	}

	async getSchema() {
		var schema = {};

		schema.name = this.name;
		schema.column = this.column;
		schema.referencedDatabaseName = this.referencedDatabaseName;
		schema.referencedTableName = this.referencedTableName;
		schema.referencedColumnName = this.referencedColumnName;
		schema.onUpdate = this.onUpdate;
		schema.onDelete = this.onDelete;

		return schema.sort();
	}

}

// Export
export default DatabaseTableRelationship;
