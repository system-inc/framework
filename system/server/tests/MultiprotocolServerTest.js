// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import MultiprotocolServer from 'framework/system/server/MultiprotocolServer.js';

// Class
class MultiprotocolServerTest extends Test {

	async testMultiprotocolServer() {
        // Create a multiprotocol server
        var multiprotocolServer = new MultiprotocolServer();
        
        // Have the server listen to a local socket protocol server

        // Have the server listen to an http protocol server

        // Create a local socket protocol client and connect to the server

        // Create an http protocol client and send a request to the server 

        //var expected = 'testKey1Value';
        //var actual = await datastoreServer.get('testKey1');
        //Assert.equal(actual, expected, 'Directly accessing the datastore through DatastoreServer');
    }

}

// Export
export default MultiprotocolServerTest;
