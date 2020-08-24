// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { Model } from '@framework/system/data/Model.js';
import { ModelProperty } from '@framework/system/data/ModelProperty.js';
import { ModelClassManager } from '@framework/system/data/ModelClassManager.js';

// Class
class ModelClassManagerTest extends Test {

	async testAddModelPropertyToModel() {
		//Transpiler.logCachedTranspiledSourceForPath(__filename);

		// Create a new model
		class TestModel extends Model {
		}
		
		// Create a new model property
		var testModelProperty = new ModelProperty('test');
		//app.log('testModelProperty', testModelProperty);

		// Add the model property to the class
		ModelClassManager.addModelPropertyToModelClass(testModelProperty, TestModel);
		//app.log('TestModel.schema', TestModel.schema);

		// Instantiate a new model
		var testModel = new TestModel();

		// Call the setter
		testModel.setTest('test value');

		// Call the getter
		var actual = testModel.getTest();

		Assert.equal(actual, 'test value', 'getting and setting a property');
	}

}

// Export
export { ModelClassManagerTest };
