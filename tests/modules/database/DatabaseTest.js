DatabaseTest = Test.extend({	

	testQueryOnDatabaseGeneratedBySettings: function*() {
		var actual = yield FrameworkTestDatabase.query('SELECT * FROM user');
		//Console.out(actual);
	},

	testQueryOnDatabaseCreatedManually: function*() {
		var databaseSettings = Project.settings.get('modules.database.databases.frameworkTest');
		//Console.out(databaseSettings);

		var frameworkTestDatabase = new Database(databaseSettings);

		var actual = yield frameworkTestDatabase.query('SELECT * FROM user');
		//Console.out(actual);
	},

	testGetSchema: function*() {
		var schema = yield FrameworkTestDatabase.getSchema();
		//Console.out(schema);
	},

});