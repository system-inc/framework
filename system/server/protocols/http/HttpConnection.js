// Dependencies
import { Connection } from '@framework/system/server/Connection.js';
import { Url } from '@framework/system/web/Url.js';
import { HttpMessageGenerator } from '@framework/system/server/protocols/http/messages/HttpMessageGenerator.js';
import { HttpRequestMessage } from '@framework/system/server/protocols/http/messages/HttpRequestMessage.js';
import { HttpResponseMessage } from '@framework/system/server/protocols/http/messages/HttpResponseMessage.js';

// Class
class HttpConnection extends Connection {

    protocol = null;
    protocolVersion = null;
    port = null;
    host = null;

    messageGenerator = null;

    constructor(nodeSocket, protocol, protocolVersion, port, host) {
        super(nodeSocket);

        this.protocol = protocol;
        this.protocolVersion = protocolVersion;
        this.port = port;
        this.host = host;

        // Listen for messages
        this.messageGenerator = new HttpMessageGenerator(this);
        this.messageGenerator.on('message', this.onMessage.bind(this));
    }

    // When the Node socket gets data
    onData(data) {
        // app.log('HttpConnection onData', data);
        
        super.onData(data);

        // Send the data to the packet generator
        this.messageGenerator.receiveDataToProcess(data);
    }

    async send(httpMessage) {
        // app.log('HttpConnection send() httpMessage', httpMessage.toString());

        // Send the message's packet over the Node socket
        this.nodeSocket.write(httpMessage.toBuffer());

        // Return the message
        return httpMessage;
    }

    async request(url, options, timeoutInMilliseconds = 1 * 1000) {
        // Hande relative URL paths
        if(!url.startsWith('http')) {
            url = new Url(this.protocol.lowercase()+'://'+this.host+':'+this.port+url);
        }

        let sentHttpMessage = await this.send(HttpRequestMessage.fromUrlAndOptions(url, options, this));

        return new Promise(function(resolve, reject) {
            var timeoutFunction = Function.schedule(timeoutInMilliseconds, function() {
                reject('Request failed, timed out after '+timeoutInMilliseconds+' milleseconds.');
            });

            var receiveResponse = function(event) {
                let incomingHttpMessage = event.data;

                // Cancel the timeout function
                Function.cancel(timeoutFunction);

                // When we get the response, remove the event listener
                this.removeEventListener('message', receiveResponse);

                // Return the HttpMessage
                resolve(incomingHttpMessage);
            }.bind(this)

            // Wait until we get a response to our request, the next message will be the response
            this.on('message', receiveResponse);
        }.bind(this));
    }

    async respond(optionsOrBodyOrHttpResponseMessage) {
        app.log('HttpConnection respond()', optionsOrBodyOrHttpResponseMessage);

        let sentHttpMessage = await this.send(HttpResponseMessage.fromOptions(optionsOrBodyOrHttpResponseMessage, this));

        return sentHttpMessage;
    }

}

// Export
export { HttpConnection };
