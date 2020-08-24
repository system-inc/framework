// Dependencies
import { Sqlite } from '@framework/system/database/sqlite/libraries/sql.js/sql.js';
import { File } from '@framework/system/file-system/File.js';

// Class
class SqliteDatabase {

	sqliteDatabase = null;
	file = null;

	constructor(path) {
		if(path) {
			this.file = new File(path);
		}

		// Load the file
		if(this.file) {
			this.sqliteDatabase = new Sqlite.Database(this.file.path);	
		}
		// Do not load a file and use an in-memory database
		else {
			this.sqliteDatabase = new Sqlite.Database();
		}
	}

	async query(sql) {
		//console.log('sql', sql);

		// Execute the query
		var executedQuery = this.sqliteDatabase.exec(sql);
		//console.log('executedQuery', executedQuery);

		// Setup the structure of the result
		var result = {
			sql: sql,
			columns: null,
			rows: null,
		};

		// Columns
		if(executedQuery[0] && executedQuery[0].columns) {
			result.columns = executedQuery[0].columns;
		}

		// Rows
		if(executedQuery[0] && executedQuery[0].values) {
			result.rows = executedQuery[0].values;
		}

		//if(executedQuery[0] && executedQuery[0].values) {
		//	result.rows = [];
		//	executedQuery[0].values.each(function(index, value) {
		//		app.highlight(index, value);
		//		//result.rows.append(value);
		//	});
		//	result.fields = ;
		//}

		return result;
	}

}

// Export
export { SqliteDatabase };
