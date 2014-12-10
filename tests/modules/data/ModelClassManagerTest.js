ModelClassManagerTest = Test.extend({

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

	testAddPropertyToModel: function() {
		// Create a new model
		var TestModel = Model.extend({
			name: 'TestModel',
		});
		
		// Create a new model property
		var testModelProperty = new ModelProperty('test');

		// Add the model property to the class
		TestModel = ModelClassManager.addPropertyToModelClass(testModelProperty, TestModel);

		// Instantiate a new model
		var testModel = new TestModel();

		// Call the setter
		testModel.setTest('test value');

		// Call the getter
		var actual = testModel.getTest();

		Assert.equal(actual, 'test value', 'getters and setters work');
	},

	testGenerateModelsFromDatabase: function*() {
		var schema = yield FrameworkTestDatabase.getSchema();
		Console.out(schema);
	},

});