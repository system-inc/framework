// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
//import SqliteDatabase from 'framework/system/database/sqlite/SqliteDatabase.js';

// Class
class SqliteDatabaseTest extends Test {

	//async testSqliteDatabase() {
	//	var testSqliteDatabase = new SqliteDatabase();

	//	// Run a query
	//	await testSqliteDatabase.query('CREATE TABLE test (column1, column2);');

	//	// Insert rows
	//	await testSqliteDatabase.query('INSERT INTO test VALUES (?,?), (?,?)', [
	//		'row1column1',
	//		'row1column2',
	//		'row2column1',
	//		'row2column2',
	//	]);

	//	// Prepare a statement
	//	var results = await testSqliteDatabase.query('SELECT * FROM test');
	//	//console.log(results);
		
	//	//var fs = require("fs");
	//	//var data = testSqliteDatabase.sqliteDatabase.export();
	//	//var buffer = new Buffer(data);
	//	//fs.writeFileSync("filename.sqlite", buffer);
	//}

}

// Export
export default SqliteDatabaseTest;
