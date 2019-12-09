// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import DomainSocketServer from 'framework/system/server/socket/DomainSocketServer.js';
import SocketServerClient from 'framework/system/server/socket/SocketServerClient.js';

// Class
class DomainSocketServerTest extends Test {

    async testDomainSocketServer() {
        // Create and initialize the server
        var domainSocketFilePath = Node.Path.join(Node.OperatingSystem.tmpdir(), app.identifier+'-test-domain-socket-server.socket');
        var domainSocketServer = new DomainSocketServer(domainSocketFilePath);
        await domainSocketServer.initialize();

        // Listen for data events
        domainSocketServer.on('data', function(event) {
            //console.log('Server: data event', event);
            var dataString = event.data.toString();
            console.log('Server: dataString -', dataString);
        });

        // Create the client
        var socketServerClient = new SocketServerClient(domainSocketServer.domainSocketFilePath);
        socketServerClient.send('hello server');
        socketServerClient.on('data', function(event) {
            var dataString = event.data.toString();
            console.log('Client: dataString -', dataString);
        }.bind(this));

        // Buy us some time for testing
        await Function.delay(50);

        // Spam a bunch of stuff for fun
        for(var i = 0; i < 10; i++) {
            //await Function.delay(50);
            socketServerClient.send('writeFromClient'+i);
            //domainSocketServer.broadcast('writeFromServer'+i);
        }

        // var expected = 'value';
        // var actual = '';
        // Assert.equal(actual, expected, 'did a thing');

        await domainSocketServer.close();
	}

}

// Export
export default DomainSocketServerTest;
