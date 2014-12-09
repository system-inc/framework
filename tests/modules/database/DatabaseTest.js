DatabaseTest = Test.extend({

	databaseSettings: {
		host: 'localhost',
		username: 'framework_test',
		password: 'framework_test',
		databaseName: 'framework_test',
	},

	before: function() {
		Project.settings.set('modules.database', {
			databases: {
				'frameworkTest': this.databaseSettings.clone(),
			},
		});

		Module.load('Database');
		Module.initialize('Database');
	},

	testQueryOnDatabaseGeneratedBySettings: function*() {
		var actual = yield FrameworkTestDatabase.query('SELECT * FROM user');
		Console.out(actual);
	},

	testQueryOnDatabaseCreatedManually: function*() {
		var frameworkTestDatabase = new Database(this.databaseSettings);
		var actual = yield frameworkTestDatabase.query('SELECT * FROM user');
		//Console.out(actual);
	},

	testGetSchema: function*() {
		var schema = yield FrameworkTestDatabase.getSchema();
		//Console.out(schema);
	},

});