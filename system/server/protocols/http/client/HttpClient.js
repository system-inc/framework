// Dependencies
import { Client } from '@framework/system/server/Client.js';
import { HttpConnection } from '@framework/system/server/protocols/http/HttpConnection.js';
import { Url } from '@framework/system/web/Url.js';
import { Version } from '@framework/system/version/Version.js';

/*
    Notes - see HttpServer.js
    This is a simple implementation of an HTTP 1.1 client using plain sockets.
    As I want to learn more about the different features of the HTTP protocol, I can implement them
    and test them with HttpProtocolTest.js

    Some things I can work on next:
    gzipping content
    HttpServer
    HTTP 2.0

    Using this client will give me 100% control over HTTP requests.
*/

// Class
class HttpClient extends Client {

    url = null;
    protocolVersion = new Version('1.1');

    constructor(url) {
        super();

        // Set the URL
        if(url === null) {
            throw new Error('URL must be specified when constructing a HttpClient.');
        }
        
        // If we already have a URL
        if(Url.is(url)) {
            this.url = url;
        }
        // If a string was provided, turn it into a Url object
        else if(String.is(url)) {
            this.url = new Url(url);
        }
        // app.log('this.url', this.url);
    }

    async connect(timeoutInMilliseconds = 1 * 1000) {
        return new Promise(function(resolve, reject) {
            // app.log('Client: Connecting...', this.url);
            
            // Timeout the promise if we never connect
            let timeoutFunction = Function.schedule(timeoutInMilliseconds, function() {
                reject('Could not connect, timed out after '+timeoutInMilliseconds.addCommas()+' milleseconds.');
            });

            // Create the connection
            let httpConnection = new HttpConnection(
                Node.Net.createConnection(
                    this.url.port,
                    this.url.host,
                    function() {
                        //console.log('HttpClient connected!');

                        // Cancel the timeout function
                        Function.cancel(timeoutFunction);
                    
                        resolve(httpConnection);
                    }.bind(this)
                ),
                this.url.protocol,
                this.protocolVersion,
                this.url.port,
                this.url.host,
            );
        }.bind(this));
    }
    
}

// Export
export { HttpClient };
