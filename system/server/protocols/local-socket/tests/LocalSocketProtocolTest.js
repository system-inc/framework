// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import LocalSocketServer from 'framework/system/server/protocols/local-socket/server/LocalSocketServer.js';
import LocalSocketClient from 'framework/system/server/protocols/local-socket/client/LocalSocketClient.js';
import File from 'framework/system/file-system/File.js';

// Class
class LocalSocketTest extends Test {

	async testLocalSocket() {
        var response = null;
        var actual = null;
        var expected = null;

        // Create a local socket protocol server
        var localSocketServer = new LocalSocketServer();
        await localSocketServer.initialize();

        // Make sure the socket file has been created
        var localSocketFilePathExists = await File.exists(localSocketServer.localSocketFilePath);
        Assert.true(localSocketFilePathExists, 'Server local socket file has been created');

        // Have the server listen for specific messages
        localSocketServer.on('message', function(event) {
            var message = event.data;
            //console.log('localSocketServer.on message event message:', message);
            //console.log('localSocketServer.on message event message.data:', message.data);

            // String
            if(message.data == 'Hi Server. Can you tell me you got these bytes?') {
                message.respond('Hi Client. I received the bytes you sent.');
            }
            // JSON
            else if(Object.is(message.data) && message.data.hasKey('question') && message.data.question == 'Do you speak JSON?') {
                message.respond({
                    answer: 'Yes I do!',
                });
            }
        });

        // Create a local socket protocol client
        var localSocketClient = new LocalSocketClient(localSocketServer.localSocketFilePath);
        await localSocketClient.initialize();
        Assert.true(localSocketClient.connected, 'Client is connected');

        // Have the client listen for specific date
        localSocketClient.on('message', function(event) {
            var message = event.data;
            //console.log('localSocketClient.on message event message:', message);
            //console.log('localSocketClient.on message event message.data:', message.data);

            // String
            if(message.data == 'Hi Client. Can you tell me you got these bytes?') {
                message.respond('Hi Server. I received the bytes you sent.');
            }
        });

        // Have the server send a broadcast just for fun
        localSocketServer.broadcast('General broadcast 1!');

        // Send a request from the client
        response = await localSocketClient.request('Hi Server. Can you tell me you got these bytes?');
        Assert.equal(localSocketClient.eventListeners.length, 1, 'Event listeners do not leak');

        // Have the server send another broadcast
        localSocketServer.broadcast('General broadcast 2!');

        // Validate the response from the server
        actual = response.data;
        expected = 'Hi Client. I received the bytes you sent.';
        Assert.equal(actual, expected, 'Client request gets the right response');
        Assert.true(String.is(actual), 'Client requests response is the right type (string)');

        // Send another request from the client
        response = await localSocketClient.request({
            question: 'Do you speak JSON?',
        });

        // Validate the second response from the sever
        actual = response.data;
        expected = {
            answer: 'Yes I do!',
        };
        Assert.deepEqual(actual, expected, 'Client request gets the right response');
        Assert.true(Object.is(actual), 'Client requests response is the right type (object)');

        // Have the server send a request to the client
        var serverConnection = localSocketServer.connections[localSocketServer.connections.getKeys().first()];
        //console.log('serverConnection', serverConnection);
        response = await serverConnection.request('Hi Client. Can you tell me you got these bytes?');
        //console.log('response', response);
        actual = response.data;
        expected = 'Hi Server. I received the bytes you sent.';
        Assert.equal(actual, expected, 'Server request gets the right response');
        Assert.true(String.is(actual), 'Server requests response is the right type (string)');

        // Performance test
        //for(var i = 0; i < 50000; i++) {
        //    await localSocketClient.request('Hi');
        //}

        console.error('write a test using respond expect response');

        // Have the client disconnect
        await localSocketClient.disconnect();
        //console.log(localSocketServer.connections);
        Assert.false(localSocketClient.connected, 'After disconnect client is no longer connected');

        // Stop the server
        await localSocketServer.stop();
        Assert.equal(localSocketServer.connections.getSize(), 0, 'Server no longer has any connections');

        // Make sure the socket file has been deleted
        localSocketFilePathExists = await File.exists(localSocketServer.localSocketFilePath);
        Assert.false(localSocketFilePathExists, 'Server local socket file has been deleted');
    }

}

// Export
export default LocalSocketTest;
