ModelTest = Test.extend({

	testModelSchema: {
		name: 'TestModel',
		properties: [
			{
				name: 'testBooleanProperty',
				type: 'boolean',
			},
			{
				name: 'testDataProperty',
				type: 'data',
			},
			{
				name: 'testDateProperty',
				type: 'date',
			},
			{
				name: 'testEnumerationProperty',
				type: 'enumeration',
				typeOptions: {
					'values': [
						'apple',
						'banana',
						'cherry',
					],
				},
			},
			{
				name: 'testIntegerProperty',
				type: 'integer',
			},
			{
				name: 'testNumberProperty',
				type: 'number',
			},
			{
				name: 'testStringProperty',
				type: 'string',
			},
			{
				name: 'testTimeProperty',
				type: 'time',
			},
		],
	},

	testModel: null,

	before: function() {
		this.testModel = ModelClassManager.generateModelClassFromSchemaModel(this.testModelSchema);
		//Console.highlight(this.testModel);
	},

	testSave: function*() {
		var testModel = new this.testModel();
		
		// Set everything
		testModel.setTestBooleanProperty(true);
		testModel.setTestDataProperty(00000100); // 64 in binary
		testModel.setTestDateProperty('1984-06-28');
		testModel.setTestEnumerationProperty('banana');
		testModel.setTestIntegerProperty(1000);
		testModel.setTestNumberProperty(123456789.123456789);
		testModel.setTestStringProperty('a string');
		testModel.setTestTimeProperty('1984-06-28 00:00:00');
		//Console.highlight(testModel);

		// Assert gets
		Assert.strictEqual(testModel.getTestBooleanProperty(), true, 'get boolean');
		Assert.strictEqual(testModel.getTestDataProperty(), 00000100, 'get data');
		Assert.strictEqual(testModel.getTestDateProperty(), '1984-06-28', 'get date');
		Assert.strictEqual(testModel.getTestEnumerationProperty(), 'banana', 'get enumeration');
		Assert.strictEqual(testModel.getTestIntegerProperty(), 1000, 'get integer');
		Assert.strictEqual(testModel.getTestNumberProperty(), 123456789.123456789, 'get number');
		Assert.strictEqual(testModel.getTestStringProperty(), 'a string', 'get string');
		Assert.strictEqual(testModel.getTestTimeProperty(), '1984-06-28 00:00:00', 'get time');

		// This is where things get fun
		//yield testModel.save();
	},

});