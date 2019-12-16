// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import LocalSocketProtocolServer from 'framework/system/server/protocols/local-socket/server/LocalSocketProtocolServer.js';
import LocalSocketProtocolClient from 'framework/system/server/protocols/local-socket/client/LocalSocketProtocolClient.js';

// Class
class LocalSocketProtocolTest extends Test {

	async testLocalSocketProtocol() {
        // Create a local socket protocol server
        var localSocketProtocolServer = new LocalSocketProtocolServer();
        await localSocketProtocolServer.initialize();

        // Listen for specific data
        localSocketProtocolServer.on('data', function(event) {
            //console.log('received data event!', event);

            var dataString = event.data.toString();
            //console.log('dataString', dataString);

            if(dataString == 'Hi Server. Can you tell me you got these bytes?') {
                event.emitter.send('Hi Client. I received the bytes you sent.');
            }
        });

        // Create a local socket protocol client
        var localSocketProtocolClient = new LocalSocketProtocolClient(localSocketProtocolServer.localSocketFilePath);

        // Send a request
        var response = await localSocketProtocolClient.request('Hi Server. Can you tell me you got these bytes?');
        console.log('response', response);
        var actual = response;
        var expected = 'Hi Client. I received the bytes you sent.';

        Assert.equal(actual, expected, 'Local socket protocol request');
    }

}

// Export
export default LocalSocketProtocolTest;
