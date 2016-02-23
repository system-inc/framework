// Dependencies
var Test = Framework.require('modules/test/Test.js');
var Assert = Framework.require('modules/test/Assert.js');
var Database = Framework.require('modules/database/Database.js');

// Class
var DatabaseTest = Test.extend({

	testQueryOnDatabaseGeneratedBySettings: function*() {
		var actual = yield FrameworkTestDatabase.query('SELECT * FROM user');
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
		var actual = yield FrameworkTestDatabase.getSchema();
		//Console.log(actual);

		Assert.true(actual.hasKey('name'), 'Database.getSchema() returns an object which has the key "name"');
		Assert.true(actual.hasKey('tables'), 'Database.getSchema() returns an object which has the key "tables"');
	},

});

// Export
module.exports = DatabaseTest;