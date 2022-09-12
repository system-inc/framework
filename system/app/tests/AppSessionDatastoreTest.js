// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';

// Class
class AppSessionDatastoreTest extends Test {
    
    async testAppSessionDatastore() {
		// Set a key in the datastore
		app.sessionDatastore.set('testKey1', 'testKey1Value');

		// Get the key
		var actual = app.sessionDatastore.get('testKey1');
		Assert.strictEqual(actual, 'testKey1Value', 'Set and get a key with app datastore');
	}

}

// Export
export { AppSessionDatastoreTest };
