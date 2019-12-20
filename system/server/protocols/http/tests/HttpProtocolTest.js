// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import HttpServer from 'framework/system/server/protocols/http/server/HttpServer.js';
import HttpClient from 'framework/system/server/protocols/http/client/HttpClient.js';

// Class
class HttpProtocolTest extends Test {

	async testHttpProtocol() {
        var response = null;
        var actual = null;
        var expected = null;

        // Create a HTTP protocol server
        var httpServer = new HttpServer(8181);
        await httpServer.initialize();

        // Have the server listen for specific data
        httpServer.on('message', function(event) {
            var message = event.data;
            console.log('httpServer.on message event message:', message);
        });

        // Create a HTTP protocol client
        // var httpClient = new HttpClient('http://127.0.0.1:8181');
        // await httpClient.initialize();
        // Assert.true(httpClient.connected, 'Client is connected');

        // // Have the client listen for specific data
        // httpClient.on('message', function(event) {
        //     var message = event.data;
        //     console.log('httpClient.on message event message:', message);
        // });

        //await httpClient.request("POST /1 HTTP/1.1\r\nHost: localhost\r\n\r\nBody");
        //await httpClient.request("POST /2 HTTP/1.1\r\nHost: localhost\r\n\r\nBody");

        //var response = await httpClient.request("GET / HTTP/1.1\r\nHost: localhost\r\n\r\n");
        //console.log('response', response);
        //response = await httpClient.request('Stinky');

        // Keep the test server open for debugging
        await Function.delay(60 * 60 * 1000);

        // Have the server send a broadcast just for fun
        //httpServer.broadcast('General broadcast 1!');

        // // Send a request from the client
        // response = await httpClient.request('Hi Server. Can you tell me you got these bytes?');
        // Assert.equal(httpClient.eventListeners.length, 1, 'Event listeners do not leak');

        // // Have the server send another broadcast
        // httpServer.broadcast('General broadcast 2!');

        // // Validate the response from the server
        // actual = response;
        // expected = 'Hi Client. I received the bytes you sent.';
        // Assert.equal(actual, expected, 'Client request gets the right response');
        // Assert.true(String.is(actual), 'Client requests response is the right type (string)');

        // // Send another request from the client
        // response = await httpClient.request({
        //     question: 'Do you speak JSON?',
        // });

        // // Validate the second response from the sever
        // actual = response;
        // expected = {
        //     answer: 'Yes I do!',
        // };
        // Assert.deepEqual(actual, expected, 'Client request gets the right response');
        // Assert.true(Object.is(actual), 'Client requests response is the right type (object)');

        // // Have the server send a request to the client
        // var serverConnection = httpServer.connections[httpServer.connections.getKeys().first()];
        // //console.log('serverConnection', serverConnection);
        // response = await serverConnection.request('Hi Client. Can you tell me you got these bytes?');
        // //console.log('response', response);
        // actual = response;
        // expected = 'Hi Server. I received the bytes you sent.';
        // Assert.equal(actual, expected, 'Server request gets the right response');
        // Assert.true(String.is(actual), 'Server requests response is the right type (string)');

        // // Performance test
        // //for(var i = 0; i < 50000; i++) {
        // //    await httpClient.request('Hi');
        // //}

        // // Have the client disconnect
        // await httpClient.disconnect();
        // //console.log(httpServer.connections);
        // Assert.false(httpClient.connected, 'After disconnect client is no longer connected');

        // // Stop the server
        // await httpServer.stop();
        // Assert.equal(httpServer.connections.getSize(), 0, 'Server no longer has any connections');

        // // Make sure the socket file has been deleted
        // httpFilePathExists = await File.exists(httpServer.httpFilePath);
        // Assert.false(httpFilePathExists, 'Server HTTP file has been deleted');
    }

}

// Export
export default HttpProtocolTest;
