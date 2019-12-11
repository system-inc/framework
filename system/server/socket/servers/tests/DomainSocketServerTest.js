// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import DomainSocketServer from 'framework/system/server/socket/servers/DomainSocketServer.js';
import SocketServerClient from 'framework/system/server/socket/clients/SocketServerClient.js';

// Class
class DomainSocketServerTest extends Test {

    domainSocketFilePath = Node.Path.join(Node.OperatingSystem.tmpdir(), app.identifier+'-test-domain-socket-server.socket');
    domainSocketServer = null;

    async beforeEach() {
        // Create and initialize the server
        this.domainSocketServer = new DomainSocketServer(this.domainSocketFilePath);
        await this.domainSocketServer.initialize();
    }

    async afterEach() {
        // Close the server
        await this.domainSocketServer.close();
    }

    async testDomainSocketServer() {
        var actual = null;

        // Listen for data events
        this.domainSocketServer.on('data', function(event) {
            //console.log('Server: data event', event);

            var dataString = event.data.toString();
            console.log('Server: dataString -', dataString);

            if(dataString == 'Hello server!') {
                event.emitter.send('Hello client!');
            }
        });

        // Create the client
        var socketServerClient = new SocketServerClient(this.domainSocketServer.domainSocketFilePath);
        socketServerClient.on('data', function(event) {
            var dataString = event.data.toString();
            console.log('Client: dataString -', dataString);
            actual = dataString;
        }.bind(this));

        // Have the client send the server a specific message
        socketServerClient.send('Hello server!');

        console.error('I need two types of packets, ones that are expecting a response and ones that dont');
        socketServerClient.send(); // does not expect a response
        await socketServerClient.sendRequest(); // expects a response within a timeout

        // Have the server respond with a specific response
        var expected = 'Hello client!';

        // Make sure the server responded with the specific response
        Assert.equal(actual, expected, 'Client can send a message to server and receive a response');

        await Function.delay(100);
	}

        //await Function.delay(50);
        // Spam a bunch of stuff for fun
        // for(var i = 0; i < 10; i++) {
        //     socketServerClient.send('writeFromClient'+i);
        //     domainSocketServer.broadcast('writeFromServer'+i);
        // }

}

// Export
export default DomainSocketServerTest;
