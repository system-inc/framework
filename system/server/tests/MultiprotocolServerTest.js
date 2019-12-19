// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import MultiprotocolServer from 'framework/system/server/MultiprotocolServer.js';
import LocalSocketProtocolServer from 'framework/system/server/protocols/local-socket/server/LocalSocketProtocolServer.js';
import LocalSocketProtocolClient from 'framework/system/server/protocols/local-socket/client/LocalSocketProtocolClient.js';

// Class
class MultiprotocolServerTest extends Test {

	async testMultiprotocolServer() {
        var actual = null;
        var expected = null;

        // Create a multiprotocol server
        var multiprotocolServer = new MultiprotocolServer();
        await multiprotocolServer.initialize();
        multiprotocolServer.on('data', function(event) {
            //console.log('multiprotocolServer event data', event.data);

            if(event.data == 'Sup from local socket client') {
                event.respond('Sup local socket client');
            }
            else if(event.data == 'Sup from HTTP client') {
                event.respond('Sup HTTP client');
            }
        });
        
        // Have the server listen to a local socket protocol server
        var localSocketProtocolServer = new LocalSocketProtocolServer();
        await multiprotocolServer.addProtocolServer(localSocketProtocolServer);
        var localSocketProtocolServerLocalSocketFilePath = localSocketProtocolServer.localSocketFilePath;
        //console.log('localSocketProtocolServerLocalSocketFilePath', localSocketProtocolServerLocalSocketFilePath);

        // Create a local socket protocol client and connect to the server
        var localSocketProtocolClient = new LocalSocketProtocolClient(localSocketProtocolServerLocalSocketFilePath);
        await localSocketProtocolClient.initialize();

        actual = await localSocketProtocolClient.request('Sup from local socket client');
        expected = 'Sup local socket client';
        Assert.equal(actual, expected, 'Local socket client requests work');

        // Have the server listen to an http protocol server
        console.error('Have the server listen to an http protocol server');

        // Create an http protocol client and send a request to the server

        // Stop the server
        await multiprotocolServer.stop();

        // Make sure the server is stopped
        Assert.true(multiprotocolServer.stopped, 'Multiprotocol server has stopped');

        // Make sure there are no connections
        Assert.equal(multiprotocolServer.connections.getSize(), 0, 'All protocol server connections have been removed');

        // Make sure there are no protocol servers
        Assert.equal(multiprotocolServer.protocolServers.getSize(), 0, 'All protocol servers have been removed');

        

        //var expected = 'testKey1Value';
        //var actual = await datastoreServer.get('testKey1');
        //Assert.equal(actual, expected, 'Directly accessing the datastore through DatastoreServer');
    }

}

// Export
export default MultiprotocolServerTest;
