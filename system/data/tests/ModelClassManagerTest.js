// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var Model = Framework.require('system/data/Model.js');
var ModelProperty = Framework.require('system/data/ModelProperty.js');
var ModelClassManager = Framework.require('system/data/ModelClassManager.js');

// Class
var ModelClassManagerTest = Test.extend({

	testAddPropertyToModel: function*() {
		// Create a new model
		var TestModel = Model.extend({
			name: 'TestModel',
		});
		
		// Create a new model property
		var testModelProperty = new ModelProperty('test');

		// Add the model property to the class
		var TestModel = ModelClassManager.addModelPropertyToModelClass(testModelProperty, TestModel);

		// Instantiate a new model
		var testModel = new TestModel();

		// Call the setter
		testModel.setTest('test value');

		// Call the getter
		var actual = testModel.getTest();

		Assert.equal(actual, 'test value', 'getting and setting a property');
	},

});

// Export
module.exports = ModelClassManagerTest;