// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { DatastoreServer } from '@framework/system/datastore/server/DatastoreServer.js';
import { DatastoreClient } from '@framework/system/datastore/server/DatastoreClient.js';
import { LocalSocketClient } from '@framework/system/server/protocols/local-socket/client/LocalSocketClient.js';
import { LocalSocketServer } from '@framework/system/server/protocols/local-socket/server/LocalSocketServer.js';

// Class
class DatastoreServerTest extends Test {

    datastoreServer = null;
    localSocketServer = null;

    async before() {
        // Create a datastore server
        this.datastoreServer = new DatastoreServer();

        // Create a LocalSocketServer to power the DatastoreServer
        this.localSocketServer = new LocalSocketServer();

        // Add the LocalSocketServer to the DatastoreServer
        await this.datastoreServer.addProtocolServer(this.localSocketServer);

        // Initialize the DatastoreServer
        await this.datastoreServer.initialize();
    }

    async after() {
        await this.datastoreServer.stop();
    }

	async testDatastoreServerDirectAccess() {
        // Set a value using the DatastoreServer direct access methods
        await this.datastoreServer.set('testKey1', 'testKey1Value');

        // Get a value using the DatastoreServer direct access methods
        var expected = 'testKey1Value';
        var actual = await this.datastoreServer.get('testKey1');

        // Make sure the value is correct
        Assert.equal(actual, expected, 'Directly accessing the datastore through DatastoreServer');
    }

    async testDatastoreClient() {
        var actual = null;
        var expected = null;

        // Set a value on the server
        await this.datastoreServer.set('testKey2', 'testKey2Value');

        // Create a datastore client
        var localSocketProtocolClient = new LocalSocketClient(this.localSocketServer.localSocketFilePath);
        var datastoreClient = new DatastoreClient(localSocketProtocolClient);
        await datastoreClient.initialize();
        // app.log('datastoreClient', datastoreClient);

        // Read the server value with the client
        actual = await datastoreClient.get('testKey1');
        // app.log('actual', actual);
        Assert.equal(actual, 'testKey1Value', 'DatastoreClient get()');

        // Set a value using the client
        await datastoreClient.set('testKey1', 'newTestKey1Value');

        // Read the server value with the client
        actual = await datastoreClient.get('testKey1');
        Assert.equal(actual, 'newTestKey1Value', 'DatastoreClient set() and then get()');

        // Listen to a key to become notified of changes
        // await datastoreClient.onChange('testKey1', function(event) {
        //     console.log('testKey1 value changed on server', event);
        //     actual = event.data;
        // });
    }

}

// Export
export { DatastoreServerTest };
