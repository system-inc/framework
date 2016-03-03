// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var Database = Framework.require('system/database/Database.js');

// Class
var DatabaseTest = Test.extend({

	testQueryOnDatabaseGeneratedBySettings: function*() {
		var frameworkTestDatabase = Project.modules.databaseModule.databaseManager.get('frameworkTest');

		var actual = yield frameworkTestDatabase.query('SELECT * FROM user');
		//Console.log(actual);

		Assert.true(actual.hasKey('sql'), 'Database.query() returns an object which has the key "sql"');
		Assert.true(actual.hasKey('rows'), 'Database.query() returns an object which has the key "rows"');
		Assert.true(actual.hasKey('fields'), 'Database.query() returns an object which has the key "fields"');
		Assert.true(actual.hasKey('stopwatch'), 'Database.query() returns an object which has the key "stopwatch"');
	},

	testQueryOnDatabaseCreatedManually: function*() {
		var databaseSettings = Project.settings.get('modules.database.databases.frameworkTest');
		//Console.log(databaseSettings);

		var frameworkTestDatabase = new Database(databaseSettings);

		var actual = yield frameworkTestDatabase.query('SELECT * FROM user');
		//Console.log(actual);

		Assert.true(actual.hasKey('sql'), 'Database.query() returns an object which has the key "sql"');
		Assert.true(actual.hasKey('rows'), 'Database.query() returns an object which has the key "rows"');
		Assert.true(actual.hasKey('fields'), 'Database.query() returns an object which has the key "fields"');
		Assert.true(actual.hasKey('stopwatch'), 'Database.query() returns an object which has the key "stopwatch"');
	},

	testGetSchema: function*() {
		var frameworkTestDatabase = Project.modules.databaseModule.databaseManager.get('frameworkTest');

		var actual = yield frameworkTestDatabase.getSchema();
		//Console.log(actual);

		Assert.true(actual.hasKey('name'), 'Database.getSchema() returns an object which has the key "name"');
		Assert.true(actual.hasKey('tables'), 'Database.getSchema() returns an object which has the key "tables"');
	},

});

// Export
module.exports = DatabaseTest;