// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { HttpServer } from '@framework/system/server/protocols/http/server/HttpServer.js';
import { HttpClient } from '@framework/system/server/protocols/http/client/HttpClient.js';
import { HttpRequestMessage } from '@framework/system/server/protocols/http/messages/HttpRequestMessage.js';
import { HttpResponseMessage } from '@framework/system/server/protocols/http/messages/HttpResponseMessage.js';

// Class
class HttpProtocolTest extends Test {

	async testHttpProtocol() {
        // let testHttpClient = new HttpClient('http://www.google.com/');
        // await testHttpClient.initialize();
        // let testResponse = await testHttpClient.request('/');
        // app.log(testResponse);
        // return;

        let response = null;
        let actual = null;
        let expected = null;

        // Create a HTTP protocol server
        let httpServer = new HttpServer(8181);
        await httpServer.initialize();

        // Have the server listen for specific data
        httpServer.on('message', function(event) {
            let httpRequestMessage = event.data;
            app.log('httpServer.on message event httpRequestMessage:', httpRequestMessage.method, httpRequestMessage.url.toString());

            // String
            if(httpRequestMessage.url.path == '/tests/string-response') {
                httpRequestMessage.respond('Responding with just a string.');
            }
        });

        // Create an HTTP protocol client
        let httpClient = new HttpClient('http://127.0.0.1:8181');
        await httpClient.initialize();
        Assert.true(httpClient.connected, 'Client is connected');
        //app.log('httpClient', httpClient);

        // Have the client listen for specific data
        httpClient.on('message', function(event) {
            let httpResponseMessage = event.data;
            app.log('httpClient.on message event httpResponseMessage.body', httpResponseMessage.body);

            // String
            // if(httpResponseMessage.body == 'Responding with just a string.') {
            //     httpResponseMessage.respond('Hi Server. I received the bytes you sent.');
            // }
        });

        response = await httpClient.request('/tests/string-response');
        // app.log('response', response);

        // Keep the test server open for debugging
        await Function.delay(60 * 60 * 1000);


        
        // [ ] responding with just data respond(string) just writes a 200 OK with response body
        // [ ] respond(object) creates an httpresponsemessage and sends it
        // [ ] respond(httpresponsemessage) just sends the message

        // TEST HEADERS
        // TEST TRAILERS

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
export { HttpProtocolTest };
