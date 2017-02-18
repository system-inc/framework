// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';

import ModelClassManager from 'framework/system/data/ModelClassManager.js';
import DatabaseTest from 'framework/system/database/tests/DatabaseTest.js';

// Class
class ModelTest extends Test {

	testModelSchema = {
		name: 'TestModel',
		properties: [
			{
				name: 'testStringPropertyWithDefaultValue',
				type: 'string',
				defaultValue: 'defaultValue!',
			},
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
	}

	testModel = null;

	shouldRun = DatabaseTest.prototype.shouldRun; // Use DatabaseTests's shouldRun method

	before() {
		this.testModel = ModelClassManager.generateModelClassFromSchemaModel(this.testModelSchema);
		//app.highlight(this.testModel);
	}

	async testSave() {
		var testModel = new this.testModel();
		
		// Set everything
		testModel.setTestBooleanProperty(true);
		testModel.setTestDataProperty(0b1000000); // 64 in binary
		testModel.setTestDateProperty('1984-06-28');
		testModel.setTestEnumerationProperty('banana');
		testModel.setTestIntegerProperty(1000);
		testModel.setTestNumberProperty(123456789.123456789);
		testModel.setTestStringProperty('a string');
		testModel.setTestTimeProperty('1984-06-28 00:00:00');
		//app.highlight(testModel);

		// Assert gets
		Assert.strictEqual(testModel.getTestStringPropertyWithDefaultValue(), 'defaultValue!', 'get string with default value');
		Assert.strictEqual(testModel.getTestBooleanProperty(), true, 'get boolean');
		Assert.strictEqual(testModel.getTestDataProperty(), 0b1000000, 'get data');
		Assert.strictEqual(testModel.getTestDateProperty(), '1984-06-28', 'get date');
		Assert.strictEqual(testModel.getTestEnumerationProperty(), 'banana', 'get enumeration');
		Assert.strictEqual(testModel.getTestIntegerProperty(), 1000, 'get integer');
		Assert.strictEqual(testModel.getTestNumberProperty(), 123456789.123456789, 'get number');
		Assert.strictEqual(testModel.getTestStringProperty(), 'a string', 'get string');
		Assert.strictEqual(testModel.getTestTimeProperty(), '1984-06-28 00:00:00', 'get time');

		// This is where things get fun
		//await testModel.save();
	}

}

// Export
export default ModelTest;
