// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import SqliteDatabase from 'framework/system/database/sqlite/SqliteDatabase.js';

// Class
class SqliteDatabaseTest extends Test {

	/* Commenting this out for now since it takes 5 seconds on average to run the first query
	async testSqliteDatabase() {
		var testSqliteDatabase = new SqliteDatabase();

		// Run a query
		await testSqliteDatabase.query('CREATE TABLE test (field1, field2);');

		// Insert rows
		await testSqliteDatabase.query('INSERT INTO test VALUES (\'firstRowField1\', \'firstRowField2\')');
		await testSqliteDatabase.query('INSERT INTO test VALUES (\'secondRowField1\', \'secondRowField2\')');

		// Prepare a statement
		var actual = await testSqliteDatabase.query('SELECT * FROM test');
		//console.log(actual);

		Assert.true(actual.hasKey('sql'), 'SqliteDatabase.query() returns an object which has the key "sql"');
		Assert.true(actual.hasKey('columns'), 'SqliteDatabase.query() returns an object which has the key "columns"');
		Assert.true(actual.hasKey('rows'), 'SqliteDatabase.query() returns an object which has the key "rows"');
		// TODO:
		//Assert.true(actual.hasKey('stopwatch'), 'SqliteDatabase.query() returns an object which has the key "stopwatch"');
		
		//var fs = await import("fs");
		//var data = testSqliteDatabase.sqliteDatabase.export();
		//var buffer = new Buffer(data);
		//fs.writeFileSync("filename.sqlite", buffer);
	}
	*/

}

// Export
export default SqliteDatabaseTest;
