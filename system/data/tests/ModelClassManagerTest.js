// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';
import Model from './../../../system/data/Model.js';
import ModelProperty from './../../../system/data/ModelProperty.js';
import ModelClassManager from './../../../system/data/ModelClassManager.js';

// Class
class ModelClassManagerTest extends Test {

	testAddPropertyToModel() {
		//Transpiler.logCachedTranspiledSourceForPath(__filename);

		// Create a new model
		//class TestModel extends Model {
		//	name = 'TestModel';
		//}

		class BlahBlah {

		}

		ModelClassManager.addModelPropertyToModelClass(BlahBlah, 1);
		
		// Create a new model property
		//var testModelProperty = new ModelProperty('test');

		//console.log('TestModel', TestModel); Node.exit();

		// Add the model property to the class
		//ModelClassManager.addModelPropertyToModelClass(testModelProperty, TestModel);

		// Instantiate a new model
		//var testModel = new TestModel();

		//// Call the setter
		//testModel.setTest('test value');

		//// Call the getter
		//var actual = testModel.getTest();

		//Assert.equal(actual, 'test value', 'getting and setting a property');
	}

}

// Export
export default ModelClassManagerTest;
