// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import DomainSocketServer from 'framework/system/server/socket/servers/DomainSocketServer.js';
import SocketServerClient from 'framework/system/server/socket/clients/SocketServerClient.js';

// Class
class DomainSocketServerTest extends Test {

    domainSocketFilePath = Node.Path.join(Node.OperatingSystem.tmpdir(), app.identifier+'-test-domain-socket-server.socket');
    domainSocketServer = null;

    socketServerClient = null;

    async beforeEach() {
        // Create and initialize the server
        this.domainSocketServer = new DomainSocketServer(this.domainSocketFilePath);
        await this.domainSocketServer.initialize();

        // Create the client
        this.socketServerClient = new SocketServerClient(this.domainSocketServer.domainSocketFilePath);
    }

    async afterEach() {
        // Close the server
        await this.domainSocketServer.close();
    }

    // async testDomainSocketServer() {
    //     // Have the server listen for our request
    //     this.domainSocketServer.on('request', function(event) {
    //         //console.log('Server: data event', event);
    //         var dataString = event.data.toString();
    //         console.log('Server: dataString -', dataString);
    //         if(dataString == 'Hello server!') {
    //             event.emitter.send('Hello client!');
    //         }
    //     });

    //     // Create the client
    //     var socketServerClient = new SocketServerClient(this.domainSocketServer.domainSocketFilePath);
    //     socketServerClient.on('data', function(event) {
    //         var dataString = event.data.toString();
    //         console.log('Client: dataString -', dataString);
    //         actual = dataString;
    //     }.bind(this));

    //     // Have the client send the server a specific message
    //     var response = await socketServerClient.sendRequest('Hello server!');

    //     // Have the server respond with a specific response
    //     var actual = response.data;
    //     var expected = 'Hello client!';

    //     // Make sure the server responded with the specific response
    //     Assert.equal(actual, expected, 'Client can send a message to server and receive a response');
    // }
    
    // async testLargeSend() {
    //     var data = String.random(2^16);
    //     console.log(data);
    //     await Function.delay(1000);
    //     this.socketServerClient.send(data);
    //     await Function.delay(1000);
    // }

        

}

// Export
export default DomainSocketServerTest;
