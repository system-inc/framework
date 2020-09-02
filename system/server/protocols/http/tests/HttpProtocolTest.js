// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { HttpServer } from '@framework/system/server/protocols/http/server/HttpServer.js';
import { HttpClient } from '@framework/system/server/protocols/http/client/HttpClient.js';
import { HttpRequestMessage } from '@framework/system/server/protocols/http/messages/HttpRequestMessage.js';
import { HttpResponseMessage } from '@framework/system/server/protocols/http/messages/HttpResponseMessage.js';
import { Headers } from '@framework/system/server/protocols/http/messages/headers/Headers.js';
import { Cookies } from '@framework/system/server/protocols/http/messages/headers/Cookies.js';
import { Version } from '@framework/system/version/Version.js';
import { Stopwatch } from '@framework/system/time/Stopwatch.js';

// Class
class HttpProtocolTest extends Test {

	async testHttpProtocol() {
        // let testHttpClient = new HttpClient('http://www.yougetsignal.com/');
        // await testHttpClient.initialize();
        // let testResponse = await testHttpClient.request('/');
        // app.log(testResponse);
        // return;

        let response = null;
        let requestData = null;
        let actual = null;
        let expected = null;

        // Create a HTTP protocol server
        let httpServer = new HttpServer(8181);
        await httpServer.initialize();

        // Have the server listen for specific data
        httpServer.on('message', function(event) {
            let httpRequestMessage = event.data;
            // app.log('httpServer.on message event httpRequestMessage:', httpRequestMessage.method, httpRequestMessage.url.toString());

            // String
            if(httpRequestMessage.url.path == '/') {
                httpRequestMessage.respond('<html><head></head><body><h1>Home Page</h1></body></html>');
            }
            // GET requests
            else if(httpRequestMessage.url.path == '/api/v1/people/1') {
                httpRequestMessage.respond({
                    data: {
                        id: '9Oiig5hTAzBFub06D35sqUMg1PVeLP7C',
                        firstName: 'Michael',
                        lastName: 'Crichton',
                    },
                });
            }
            // POST requests
            else if(
                httpRequestMessage.method == HttpRequestMessage.methods.post &&
                httpRequestMessage.url.path == '/api/v1/people/'
            ) {
                httpRequestMessage.respond({
                    data: {
                        id: httpRequestMessage.data.id,
                        firstName: httpRequestMessage.data.firstName,
                        lastName: httpRequestMessage.data.lastName,
                    },
                });
            }
            // Cookie headers
            else if(httpRequestMessage.url.path == '/cookies') {
                // Get the client cookies
                let clientCookies = httpRequestMessage.cookies;
                // Add the server cookies
                clientCookies.create('serverCookie1', 'serverCookie1Value');
                clientCookies.create('serverCookie2', 'serverCookie2Value');
                httpRequestMessage.respond({
                    cookies: clientCookies,
                });
            }
        });

        // Create a HTTP protocol client
        let httpClient = new HttpClient('http://127.0.0.1:8181');
        await httpClient.initialize();
        Assert.true(httpClient.connected, 'Client is connected');
        //app.log('httpClient', httpClient);

        // String responses
        response = await httpClient.request('/');
        // app.log('response', response);
        Assert.strictEqual(response.protocol, 'HTTP', 'String protocl');
        Assert.true(Version.is(response.protocolVersion), 'Protocol version is instance of Version');
        Assert.true(Headers.is(response.headers), 'Headers is instance of Headers');
        Assert.true(Headers.is(response.trailers), 'Trailers is instance of Headers');
        Assert.true(Cookies.is(response.cookies), 'Cookies is instance of Cookies');
        Assert.strictEqual(response.body, '<html><head></head><body><h1>Home Page</h1></body></html>', 'String body');
        Assert.strictEqual(response.data, null, 'Null data property when body is not JSON');
        Assert.strictEqual(response.statusCode, 200, 'Numeric status code');
        Assert.strictEqual(response.statusMessage, 'OK', 'String status message');
        
        // GET
        response = await httpClient.request('/api/v1/people/1');
        // app.log('response', response);
        Assert.deepEqual(
            response.data,
            {
                id: '9Oiig5hTAzBFub06D35sqUMg1PVeLP7C',
                firstName: 'Michael',
                lastName: 'Crichton',
            },
            'GET requests with data property populated'
        );

        // POST
        requestData = {
            id: String.random(),
            firstName: 'Kirk',
            lastName: 'Ouimet',
        };
        response = await httpClient.request('/api/v1/people/', {
            method: 'POST',
            data: requestData,
        });
        // app.log('response', response);
        Assert.deepEqual(
            response.data,
            requestData,
            'POST requests with data property populated'
        );

        // Cookies
        let cookies = new Cookies();
        cookies.create('clientCookie1', 'clientCookie1Value');
        cookies.create('clientCookie2', 'clientCookie2Value');
        response = await httpClient.request('/cookies', {
            cookies: cookies,
        });
        // app.log('response', response.cookies);
        Assert.strictEqual(response.cookies.cookies.length, 4, 'Server sent both server and client cookies back');
        Assert.strictEqual(response.cookies.get('serverCookie2'), 'serverCookie2Value', 'Server sent server cookie');
        Assert.strictEqual(response.cookies.get('clientCookie2'), 'clientCookie2Value', 'Server sent client cookie back correctly');

        // Stop the server
        await httpServer.stop();

        // await Function.delay(60 * 60 * 1000); // Keep the test server open for debugging
    }

    async skiptestPerformance() {
        let requestCount = 10000;
        let responseCount = 0; // Keep track of how many responses we have received

        // Start the stopwatch
        let stopwatch = new Stopwatch();
        stopwatch.start();

        // Create a HTTP protocol server
        let httpServer = new HttpServer(8181);
        await httpServer.initialize();
        httpServer.on('message', function(event) {
            event.data.respond('<html><head></head><body><h1>Test</h1></body></html>');
        });

        await new Promise(async function(resolve, reject) {
            // Off to the races
            for(let i = 0; i < requestCount; i++) {
                // Create a HTTP protocol client
                let httpClient = new HttpClient('http://127.0.0.1:8181');
                await httpClient.initialize();

                // Listen for messages
                httpClient.on('message', function() {
                    responseCount++;

                    // If we got all of the responses
                    if(responseCount == requestCount) {
                        stopwatch.stop();
                        let millisecondsPassed = stopwatch.getHighResolutionElapsedTime();
                        console.log('Executed', requestCount.addCommas(), 'requests in', Number.round(millisecondsPassed).addCommas(), 'milliseconds ('+Number.round(requestCount / millisecondsPassed * 1000).addCommas()+' requests/second)');
                        resolve(true);
                    }
                });

                // Make the request
                httpClient.request('/');
            }
        }.bind(this));
    }

}

// Export
export { HttpProtocolTest };
