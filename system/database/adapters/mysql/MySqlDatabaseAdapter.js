// Dependencies
import { DatabaseField } from '@framework/system/database/DatabaseField.js';

// Class
class MySqlAdapter {

	static reformFields(fields) {
		var reformedFields = {};

		fields.each(function(index, column) {
			var databaseField = new DatabaseField();

			databaseField.databaseName = column.db;

			databaseField.tableName = column.table;
			databaseField.originalTableName = column.orgTable;

			databaseField.name = column.name;
			databaseField.originalName = column.orgName;
			
			//databaseField.characterSetId = column.charsetNr;
			//databaseField.length = column.length;
			//databaseField.type = column.type;
			//databaseField.flags = column.flags;
			//databaseField.decimals = column.decimals;

			//databaseField.catalog = column.catalog;
			//databaseField.zeroFill = column.zeroFill;
			//databaseField.protocol41 = column.protocol41;

			reformedFields[column.name] = databaseField;
		});

		return reformedFields;
	}

	static async query(connection, query, values) {
		var query = await new Promise(function(resolve, reject) {
			var queryResults = connection.query(query, values, function(error, rows, fields) {
				//app.log(queryResults.sql);

				if(error) {
					resolve(error);
				}
				else {
					var result = {
						sql: queryResults.sql,
						//values: queryResults.values,
						rows: rows,
						fields: MySqlAdapter.reformFields(fields),
					};

					resolve(result);
				}
			});
	    });

	    return query;
	}

}

// Export
export { MySqlAdapter };
