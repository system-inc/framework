// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';

// Class
class AppDatastoreTest extends Test {

	async testAppDatastore() {
		// Set a key in the datastore
		app.datastore.set('testKey1', 'testKey1Value');

		// Get the key
		var actual = app.datastore.get('testKey1');
		Assert.strictEqual(actual, 'testKey1Value', 'Set and get a key with app datastore');
    }

}

// Export
export { AppDatastoreTest };
