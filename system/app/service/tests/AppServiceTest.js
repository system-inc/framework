// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';

// Class
class AppServiceTest extends Test {

    async testAppServiceDatastore() {
        var expected = 'value';

        // Store data in session datastore
        app.datastore.set('testAppServiceDatastoreKey1', expected);

        // Get data from session datastore
        var actual = app.datastore.get('testAppServiceDatastoreKey1');

        Assert.equal(actual, expected, 'set and get data from datastore');
	}

	async testAppServiceSessionDatastore() {
        var expected = 'value';

        // Store data in session datastore
        app.sessionDatastore.set('testAppServiceSessionDatastoreKey1', expected);

        // Get data from session datastore
        var actual = app.sessionDatastore.get('testAppServiceSessionDatastoreKey1');

        Assert.equal(actual, expected, 'set and get data from session datastore');
	}

}

// Export
export default AppServiceTest;
