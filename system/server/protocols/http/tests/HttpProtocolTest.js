// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import HttpServer from 'framework/system/server/protocols/http/server/HttpServer.js';
import HttpClient from 'framework/system/server/protocols/http/client/HttpClient.js';
import HttpRequestMessage from 'framework/system/server/protocols/http/messages/HttpRequestMessage.js';
import HttpResponseMessage from 'framework/system/server/protocols/http/messages/HttpResponseMessage.js';

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
            var httpRequestMessage = event.data;
            //console.log('httpServer.on message event message:', httpRequestMessage);

            console.error('TO DO');
            // [ ] responding with just data respond(string) just writes a 200 OK with response body
            // [ ] respond(object) creates an httpresponsemessage and sends it
            // [ ] respond(httpresponsemessage) just sends the message

            if(httpRequestMessage.url.path == '/tests/string-response') {
                httpRequestMessage.respond('Responding with just a string.');
            }

            // var httpResponseMessage = new HttpResponseMessage();
            // httpResponseMessage.statusCode = 404;
            // httpRequestMessage.respond(httpResponseMessage);
        });

        // Create a HTTP protocol client
        var httpClient = new HttpClient('http://127.0.0.1:8181');
        await httpClient.initialize();
        Assert.true(httpClient.connected, 'Client is connected');

        // Have the client listen for specific data
        httpClient.on('message', function(event) {
            var httpResponseMessage = event.data;
            console.log('httpClient.on message event message:', message);
        });

        console.error('TO DO');
        // define how we send requests
        // [ ] requesting with just data request(string) assumes string is a URL and method is GET
        // [ ] request(object) creates an httprequestmessage and sends it
        // [ ] request(httprequestmessage) just sends the message

        await httpClient.request('/tests/string-response');
        //await httpClient.request("POST /2 HTTP/1.1\r\nHost: localhost\r\n\r\nBody");

        //var response = await httpClient.request("GET / HTTP/1.1\r\nHost: localhost\r\n\r\n");
        //console.log('response', response);
        //response = await httpClient.request('Stinky');

        // Keep the test server open for debugging
        await Function.delay(60 * 60 * 1000);

        // LOCAL SOCKET TEST

        // // Have the server listen for specific messages
        // localSocketServer.on('message', async function(event) {
        //     var message = event.data;
        //     //console.log('localSocketServer.on message event message:', message);
        //     //console.log('localSocketServer.on message event message.data:', message.data);

        //     // String
        //     if(message.data == 'Hi Server. Can you tell me you got these bytes?') {
        //         message.respond('Hi Client. I received the bytes you sent.');
        //     }
        //     // JSON
        //     else if(Object.is(message.data) && message.data.hasKey('question') && message.data.question == 'Do you speak JSON?') {
        //         message.respond({
        //             answer: 'Yes I do!',
        //         });
        //     }
        //     else if(message.data == 'Server, what is your purpose?') {
        //         message.respond('Client, what do you think my purpose is?');
        //     }
        //     else if(message.data == 'Server, I think you live to serve.') {
        //         message.respond('Client, I live to serve.');
        //     }
        // });

        // // Have the client listen for specific date
        // localSocketClient.on('message', function(event) {
        //     var message = event.data;
        //     //console.log('localSocketClient.on message event message:', message);
        //     //console.log('localSocketClient.on message event message.data:', message.data);

        //     // String
        //     if(message.data == 'Hi Client. Can you tell me you got these bytes?') {
        //         message.respond('Hi Server. I received the bytes you sent.');
        //     }
        // });

        // // Have the server send a broadcast just for fun
        // localSocketServer.broadcast('General broadcast 1!');

        // // Send a request from the client
        // response = await localSocketClient.request('Hi Server. Can you tell me you got these bytes?');
        // Assert.equal(localSocketClient.eventListeners.length, 1, 'Event listeners do not leak');

        // // Have the server send another broadcast
        // localSocketServer.broadcast('General broadcast 2!');

        // // Validate the response from the server
        // actual = response.data;
        // expected = 'Hi Client. I received the bytes you sent.';
        // Assert.equal(actual, expected, 'Client request gets the right response');
        // Assert.true(String.is(actual), 'Client requests response is the right type (string)');

        // // Send another request from the client
        // response = await localSocketClient.request({
        //     question: 'Do you speak JSON?',
        // });

        // // Validate the second response from the sever
        // actual = response.data;
        // expected = {
        //     answer: 'Yes I do!',
        // };
        // Assert.deepEqual(actual, expected, 'Client request gets the right response');
        // Assert.true(Object.is(actual), 'Client requests response is the right type (object)');

        // // Have the server send a request to the client
        // var serverConnection = localSocketServer.connections[localSocketServer.connections.getKeys().first()];
        // //console.log('serverConnection', serverConnection);
        // response = await serverConnection.request('Hi Client. Can you tell me you got these bytes?');
        // //console.log('response', response);
        // actual = response.data;
        // expected = 'Hi Server. I received the bytes you sent.';
        // Assert.equal(actual, expected, 'Server request gets the right response');
        // Assert.true(String.is(actual), 'Server requests response is the right type (string)');

        // // Have the client send a request, get a response, send a response, and get a response
        // var serverResponse1 = await localSocketClient.request('Server, what is your purpose?');
        // if(serverResponse1.data == 'Client, what do you think my purpose is?') {
        //     var serverResponse2 = await serverResponse1.respond('Server, I think you live to serve.');
        // }
        // actual = serverResponse2.data;
        // expected = 'Client, I live to serve.';
        // Assert.equal(actual, expected, 'Reponses can be responded to');

        // // Performance test
        // //for(var i = 0; i < 50000; i++) {
        // //    await localSocketClient.request('Hi');
        // //}

        // // Have the client disconnect
        // await localSocketClient.disconnect();
        // //console.log(localSocketServer.connections);
        // Assert.false(localSocketClient.connected, 'After disconnect client is no longer connected');

        // // Stop the server
        // await localSocketServer.stop();
        // Assert.equal(localSocketServer.connections.getSize(), 0, 'Server no longer has any connections');

        // // Make sure the socket file has been deleted
        // localSocketFilePathExists = await File.exists(localSocketServer.localSocketFilePath);
        // Assert.false(localSocketFilePathExists, 'Server local socket file has been deleted');
    }

}

// Export
export default HttpProtocolTest;
