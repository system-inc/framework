// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { Datastore } from '@framework/system/datastore/Datastore.js';
import { DatastoreServer } from '@framework/system/datastore/server/DatastoreServer.js';
import { DatastoreClient } from '@framework/system/datastore/server/DatastoreClient.js';

// Class
class DatastoreServerTest extends Test {

	async testDatastoreServerDirectAccess() {
        // Create a datastore server
        var datastoreServer = new DatastoreServer(new Datastore());
        
        // Set a value using the DatastoreServer direct access methods
        await datastoreServer.set('testKey1', 'testKey1Value');

        // Get a value using the DatastoreServer direct access methods
        var expected = 'testKey1Value';
        var actual = await datastoreServer.get('testKey1');

        // Make sure the value is correct
        Assert.equal(actual, expected, 'Directly accessing the datastore through DatastoreServer');
    }

    async SKIPtestDatastoreServerClient() {
        var actual = null;
        var expected = null;

        // Write the syntax below how I want the final syntax to be

        // Create a datastore server with an empty in-memory datastore

        // TODO: The datastore server needs protocols to listen to

        /*
            A datastore server needs 2 things
             1. A datastore object it uses
             2. Protocol server(s)

            There are two types of servers
            1. Protocol servers - base level servers that handle just the data passing back and forth
            2. Servers - these servers listen to one or more protocol servers and do work
                can listen to 0+ protocol servers
                dont worry about how the underlying data is transferred
                
        */

        var datastoreServer = new DatastoreServer(new Datastore());
        await datastoreServer.initialize();

        // Create a datastore client

        // TODO: The datastore client needs to know which protocol to connect with and the path to that protocol

        var datastoreClient = new DatastoreClient();
        await datastoreClient.initialize();
        
        // Set a value using the DatastoreServer direct access methods
        await datastoreClient.set('testKey1', 'testKey1Value');

        // Get a value using the DatastoreServer direct access methods
        expected = 'testKey1Value';
        actual = await datastoreClient.get('testKey1');

        // Make sure the value is correct
        Assert.equal(actual, expected, 'Accessing the datastore through DatastoreClient');

        // Listen to a key to become notified of changes
        await datastoreClient.onChange('testKey1', function(event) {
            console.log('testKey1 value changed on server', event);
            actual = event.data;
        });

        // Change the value on the server
        await datastoreServer.set('testKey1', 'updatedTestKey1Value');

        // Make sure the value was updated
        expected = 'updatedTestKey1Value';
        Assert.equal(actual, expected, 'onChange works');
    }

}

// Export
export { DatastoreServerTest };
