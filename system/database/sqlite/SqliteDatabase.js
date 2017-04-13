// Dependencies
import Sqlite from 'framework/system/database/sqlite/libraries/sql.js/sql.js';
import File from 'framework/system/file-system/File.js';

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
		// Do not load a file
		else {
			this.sqliteDatabase = new Sqlite.Database();
		}
	}

	async query(sqlString) {
		var exec = this.sqliteDatabase.exec(sqlString);
		//console.log('exec', exec);

		var result = {
			sql: sqlString,
			//values: queryResults.values,
			rows: null,
			fields: null,
		};

		if(exec[0] && exec[0].values) {
			result.rows = [];
			exec[0].values.each(function(index, value) {
				//console.log(index, value);
			});
			result.fields = exec[0].columns;
		}

		return result;
	}

}

// Export
export default SqliteDatabase;
