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

	testDatabase: function*() {
		//var actual = yield FrameworkTestDatabase.query('SELECT * FROM user');
		//Console.out(actual);
	},

	testManualDatabase: function*() {
		//var frameworkTestDatabase = new Database(this.databaseSettings);
		//var actual = yield frameworkTestDatabase.query('SELECT * FROM user');
		//Console.out(actual);
	},

});