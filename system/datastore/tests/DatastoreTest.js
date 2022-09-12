// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { Datastore } from '@framework/system/datastore/Datastore.js';

// Class
class DatastoreTest extends Test {

	async testSetAndGet() {
        let datastore = new Datastore();

		// Set a key in the datastore
		datastore.set('testKey1', 'testKey1Value');

		// Get the key
		var actual = datastore.get('testKey1');
		Assert.strictEqual(actual, 'testKey1Value', 'Set and get a key with app datastore');
    }

    async testSetEvent() {
        let datastore = new Datastore();
        let capturedEvent = null;

        datastore.on('set:testKey1', function(event) {
            capturedEvent = event;
        });

        // Set a key in the datastore
        datastore.set('testKey1', 'testKey1Value');

        Assert.strictEqual(capturedEvent.data, 'testKey1Value', 'set:path event was emitted');
    }

    async testSetEventWithNestedPath() {
        let datastore = new Datastore();
        let capturedEvent = null;

        datastore.on('set:testKey1.testKeyA', function(event) {
            capturedEvent = event;
        });

        // Set a key in the datastore
        datastore.set('testKey1.testKeyA', 'testKey1AValue');

        Assert.strictEqual(capturedEvent.data, 'testKey1AValue', 'set:path event with nested path was emitted');
    }

    async testDeleteEventWithNestedPath() {
        let datastore = new Datastore();
        let capturedEvent = null;

        datastore.on('delete:testKey1.testKeyA', function(event) {
            capturedEvent = event;
        });

        // Set a key in the datastore
        datastore.set('testKey1.testKeyA', 'testKey1AValue');

        // Delete the key
        datastore.delete('testKey1.testKeyA');

        // console.log('capturedEvent', capturedEvent);

        Assert.strictEqual(capturedEvent.identifier, 'delete:testKey1.testKeyA', 'delete:path event with nested path was emitted');
    }

}

// Export
export { DatastoreTest };
