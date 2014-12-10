ModelTest = Test.extend({

	testModelSchema: {
		name: 'Test',
		properties: [
			{
				name: 'id',
				type: 'integer',
			}
		],
	},

	testModel: null,

	before: function() {
		this.testModel = ModelClassManager.generateModelFromSchema(this.testModelSchema);
	},

	testSave: function() {

		// Create a new model
		var TestModel = Model.extend({
			name: 'TestModel',
		});

	},

});