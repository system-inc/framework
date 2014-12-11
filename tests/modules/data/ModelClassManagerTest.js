ModelClassManagerTest = Test.extend({

	testAddPropertyToModel: function*() {
		// Create a new model
		var TestModel = Model.extend({
			name: 'TestModel',
		});
		
		// Create a new model property
		var testModelProperty = new ModelProperty('test');

		// Add the model property to the class
		TestModel = ModelClassManager.addModelPropertyToModelClass(testModelProperty, TestModel);

		// Instantiate a new model
		var testModel = new TestModel();

		// Call the setter
		testModel.setTest('test value');

		// Call the getter
		var actual = testModel.getTest();

		Assert.equal(actual, 'test value', 'getting and setting a property');
	},

});