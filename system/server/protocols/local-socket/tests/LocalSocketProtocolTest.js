// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import LocalSocketProtocolServer from 'framework/system/server/protocols/local-socket/server/LocalSocketProtocolServer.js';
import LocalSocketProtocolClient from 'framework/system/server/protocols/local-socket/client/LocalSocketProtocolClient.js';
import File from 'framework/system/file-system/File.js';

// Class
class LocalSocketProtocolTest extends Test {

	async testLocalSocketProtocol() {
        var response = null;
        var actual = null;
        var expected = null;

        // Create a local socket protocol server
        var localSocketProtocolServer = new LocalSocketProtocolServer();
        await localSocketProtocolServer.initialize();

        // Make sure the socket file has been created
        var localSocketFilePathExists = await File.exists(localSocketProtocolServer.localSocketFilePath);
        Assert.true(localSocketFilePathExists, 'Server local socket file has been created');

        // Have the server listen for specific data
        localSocketProtocolServer.on('data', function(event) {
            //console.log('localSocketProtocolServer.on data event', event);
            //console.log('localSocketProtocolServer.on data event data', event.data);

            // String
            if(event.data == 'Hi Server. Can you tell me you got these bytes?') {
                event.respond('Hi Client. I received the bytes you sent.');
            }
            // JSON
            else if(Object.is(event.data) && event.data.hasKey('question') && event.data.question == 'Do you speak JSON?') {
                event.respond({
                    answer: 'Yes I do!',
                });
            }
        });

        // Create a local socket protocol client
        var localSocketProtocolClient = new LocalSocketProtocolClient(localSocketProtocolServer.localSocketFilePath);
        await localSocketProtocolClient.initialize();
        Assert.true(localSocketProtocolClient.connected, 'Client is connected');

        // Have the client listen for specific date
        localSocketProtocolClient.on('data', function(event) {
            //console.log('localSocketProtocolClient.on data event', event);
            //console.log('localSocketProtocolClient.on data event.data', event.data);

            // String
            if(event.data == 'Hi Client. Can you tell me you got these bytes?') {
                //console.log('localSocketProtocolClient.on data event', event);
                event.respond('Hi Server. I received the bytes you sent.');
            }
        });

        // Have the server send a broadcast just for fun
        localSocketProtocolServer.broadcast('General broadcast 1!');

        // Send a request from the client
        response = await localSocketProtocolClient.request('Hi Server. Can you tell me you got these bytes?');
        Assert.equal(localSocketProtocolClient.eventListeners.length, 1, 'Event listeners do not leak');

        // Have the server send another broadcast
        localSocketProtocolServer.broadcast('General broadcast 2!');

        // Validate the response from the server
        actual = response;
        expected = 'Hi Client. I received the bytes you sent.';
        Assert.equal(actual, expected, 'Client request gets the right response');
        Assert.true(String.is(actual), 'Client requests response is the right type (string)');

        // Send another request from the client
        response = await localSocketProtocolClient.request({
            question: 'Do you speak JSON?',
        });

        // Validate the second response from the sever
        actual = response;
        expected = {
            answer: 'Yes I do!',
        };
        Assert.deepEqual(actual, expected, 'Client request gets the right response');
        Assert.true(Object.is(actual), 'Client requests response is the right type (object)');

        // Have the server send a request to the client
        var serverConnection = localSocketProtocolServer.connections[localSocketProtocolServer.connections.getKeys().first()];
        //console.log('serverConnection', serverConnection);
        response = await serverConnection.request('Hi Client. Can you tell me you got these bytes?');
        //console.log('response', response);
        actual = response;
        expected = 'Hi Server. I received the bytes you sent.';
        Assert.equal(actual, expected, 'Server request gets the right response');
        Assert.true(String.is(actual), 'Server requests response is the right type (string)');

        // Performance test
        //for(var i = 0; i < 50000; i++) {
        //    await localSocketProtocolClient.request('Hi');
        //}

        // Have the client disconnect
        await localSocketProtocolClient.disconnect();
        //console.log(localSocketProtocolServer.connections);
        Assert.false(localSocketProtocolClient.connected, 'After disconnect client is no longer connected');

        // Stop the server
        await localSocketProtocolServer.stop();
        Assert.equal(localSocketProtocolServer.connections.getKeys().length, 0, 'Server no longer has any connections');

        // Make sure the socket file has been deleted
        localSocketFilePathExists = await File.exists(localSocketProtocolServer.localSocketFilePath);
        Assert.false(localSocketFilePathExists, 'Server local socket file has been deleted');
    }

}

// Export
export default LocalSocketProtocolTest;
