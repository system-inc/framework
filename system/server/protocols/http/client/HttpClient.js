// Dependencies
import { Client } from '@framework/system/server/Client.js';
import { HttpConnection } from '@framework/system/server/protocols/http/HttpConnection.js';
import { Url } from '@framework/system/web/Url.js';

// Class
class HttpClient extends Client {

    url = null;

    constructor(url) {
        super();

        // Set the local socket file path
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
            //console.log('Client: Connecting...');
            
            // Timeout the promise if we never connect
            var timeoutFunction = Function.schedule(timeoutInMilliseconds, function() {
                reject('Could not connect, timed out after '+timeoutInMilliseconds+' milleseconds.');
            });

            // Create the connection
            var connection = new HttpConnection(
                Node.Net.createConnection(this.url.port, this.url.host, function() {
                    //console.log('HttpClient connected!');

                    // Cancel the timeout function
                    Function.cancel(timeoutFunction);
                
                    resolve(connection);
                }.bind(this)),
                this.url.protocol,
                this.url.port,
                this.url.host
            );
        }.bind(this));
    }
    
}

// Export
export { HttpClient };
