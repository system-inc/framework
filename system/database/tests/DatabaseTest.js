// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';
import Database from './../../../system/database/Database.js';

// Class
class DatabaseTest extends Test {

	async shouldRun() {
		var shouldRun = true;

		var frameworkTestDatabase = Project.modules.databaseModule.databaseManager.get('frameworkTest');
		var testQueryResults = await frameworkTestDatabase.query('SELECT 1 + 1 as `solution`');
		//app.info(testQueryResults);

		if(Error.is(testQueryResults)) {
			shouldRun = false;
		}

		return shouldRun;
	}

	async testQueryOnDatabaseGeneratedBySettings() {
		var frameworkTestDatabase = Project.modules.databaseModule.databaseManager.get('frameworkTest');

		var actual = await frameworkTestDatabase.query('SELECT * FROM user');
		//app.log(actual);

		Assert.true(actual.hasKey('sql'), 'Database.query() returns an object which has the key "sql"');
		Assert.true(actual.hasKey('rows'), 'Database.query() returns an object which has the key "rows"');
		Assert.true(actual.hasKey('fields'), 'Database.query() returns an object which has the key "fields"');
		Assert.true(actual.hasKey('stopwatch'), 'Database.query() returns an object which has the key "stopwatch"');
	}

	async testQueryOnDatabaseCreatedManually() {
		var databaseSettings = Project.settings.get('modules.database.databases.frameworkTest');
		//app.log(databaseSettings);

		var frameworkTestDatabase = new Database(databaseSettings);

		var actual = await frameworkTestDatabase.query('SELECT * FROM user');
		//app.log(actual);

		Assert.true(actual.hasKey('sql'), 'Database.query() returns an object which has the key "sql"');
		Assert.true(actual.hasKey('rows'), 'Database.query() returns an object which has the key "rows"');
		Assert.true(actual.hasKey('fields'), 'Database.query() returns an object which has the key "fields"');
		Assert.true(actual.hasKey('stopwatch'), 'Database.query() returns an object which has the key "stopwatch"');
	}

	async testGetSchema() {
		var frameworkTestDatabase = Project.modules.databaseModule.databaseManager.get('frameworkTest');

		var actual = await frameworkTestDatabase.getSchema();
		//app.log(actual);

		Assert.true(actual.hasKey('name'), 'Database.getSchema() returns an object which has the key "name"');
		Assert.true(actual.hasKey('tables'), 'Database.getSchema() returns an object which has the key "tables"');
	}

}

// Export
export default DatabaseTest;
