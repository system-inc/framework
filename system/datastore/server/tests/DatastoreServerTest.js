// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import Datastore from 'framework/system/datastore/Datastore.js';
import DatastoreServer from 'framework/system/datastore/server/DatastoreServer.js';
import DatastoreClient from 'framework/system/datastore/server/DatastoreClient.js';

// Class
class DatastoreServerTest extends Test {

	async testDatastoreServerDirectAccess() {
        // Create a datastore server
        var datastoreServer = new DatastoreServer(new Datastore());
        
        // Set a property using the DatastoreServer direct access methods
        await datastoreServer.set('testKey1', 'testKey1Value');

        // Get a property using the DatastoreServer direct access methods
        var expected = 'testKey1Value';
        var actual = await datastoreServer.get('testKey1');

        // Make sure the property is correct
        Assert.equal(actual, expected, 'Directly accessing the datastore through DatastoreServer');
    }

    async testDatastoreServerClient() {
        // Create a datastore server
        var datastoreServer = new DatastoreServer(new Datastore());

        // Create a datastore client
        var datastoreClient = new DatastoreClient();
        
        // Set a property using the DatastoreServer direct access methods
        await datastoreClient.set('testKey1', 'testKey1Value');

        // Get a property using the DatastoreServer direct access methods
        var expected = 'testKey1Value';
        var actual = await datastoreClient.get('testKey1');

        // Make sure the property is correct
        Assert.equal(actual, expected, 'Accessing the datastore through DatastoreClient');
    }

}

// Export
export default DatastoreServerTest;
