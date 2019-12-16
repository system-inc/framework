// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import LocalSocketProtocolServer from 'framework/system/server/protocols/local-socket/server/LocalSocketProtocolServer.js';
import LocalSocketProtocolClient from 'framework/system/server/protocols/local-socket/client/LocalSocketProtocolClient.js';
import File from 'framework/system/file-system/File.js';

// Class
class LocalSocketProtocolTest extends Test {

	async testLocalSocketProtocol() {
        // Create a local socket protocol server
        var localSocketProtocolServer = new LocalSocketProtocolServer();
        await localSocketProtocolServer.initialize();

        var localSocketFilePathExists = await File.exists(localSocketProtocolServer.localSocketFilePath);
        Assert.true(localSocketFilePathExists, 'Server local socket file has been created');

        // Listen for specific data
        localSocketProtocolServer.on('data', function(event) {
            //console.log('localSocketProtocolServer.on data event', event);
            console.log('localSocketProtocolServer.on data event data', event.data);

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

        // Send a broadcast
        localSocketProtocolServer.broadcast('General broadcast 1!');

        // Send a request from the client
        var response = await localSocketProtocolClient.request('Hi Server. Can you tell me you got these bytes?');

        // Send another broadcast
        localSocketProtocolServer.broadcast('General broadcast 2!');

        var actual = response;
        var expected = 'Hi Client. I received the bytes you sent.';

        Assert.equal(actual, expected, 'Client request gets the right response');
        Assert.true(String.is(actual), 'Client requests response is the right type (string)');

        // Send another request from the client
        response = await localSocketProtocolClient.request({
            question: 'Do you speak JSON?',
        });

        var actual = response;
        var expected = {
            answer: 'Yes I do!',
        };

        Assert.deepEqual(actual, expected, 'Client request gets the right response');
        Assert.true(Object.is(actual), 'Client requests response is the right type (object)');

        // Stop the server
        await localSocketProtocolServer.stop();

        localSocketFilePathExists = await File.exists(localSocketProtocolServer.localSocketFilePath);
        Assert.false(localSocketFilePathExists, 'Server local socket file still exists');

        console.error('do an assertion to verify the event listeners have been removed from the request')
        console.error('write a test where the client asks for the connection to be closed and the connection is closed')

    }

}

// Export
export default LocalSocketProtocolTest;
