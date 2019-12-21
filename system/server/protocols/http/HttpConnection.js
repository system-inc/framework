// Dependencies
import Connection from 'framework/system/server/Connection.js';
import HttpRequestMessage from 'framework/system/server/protocols/http/messages/HttpRequestMessage.js';

// Class
class HttpConnection extends Connection {

    protocol = null;
    port = null;
    host = null;

    constructor(nodeSocket, protocol, port, host) {
        super(nodeSocket);

        this.protocol = protocol.uppercase();
        this.port = port;
        this.host = host;
    }

    async send(data) {
        //console.log('HttpConnection.send ---');
        //console.log(data);
        //console.log('^ ---');
        this.nodeSocket.write(data);

        // //console.log('LocalSocketConnection send', 'messageOrData', messageOrData, 'correlatingMessage', correlatingMessage);

        // var message = null;

        // // If we are sending an existing message
        // if(LocalSocketMessage.is(messageOrData)) {
        //     message = messageOrData;
        // }
        // // If we need to create the message
        // else {
        //     message = new LocalSocketMessage(this, messageOrData);
        // }

        // // If there is a correlating message, set the correlation identifier
        // if(correlatingMessage !== null) {
        //     message.correlationIdentifier = correlatingMessage.correlationIdentifier;
        // }

        // // Send the message's packet over the Node socket
        // message.sendPacket(this.nodeSocket);

        // // Return the message
        // return message;
    }

    async request(request, correlatingMessage = null, timeoutInMilliseconds = 1 * 1000) {
        var httpRequestMessage = null;

        // If the request is a string, assume it is a URL path and the method is GET
        if(String.is(request)) {
            httpRequestMessage = HttpRequestMessage.constructFromUrlPath(this, request);
        }
        // If the request is an object, build an HttpRequestMessage with the properties
        else if(Object.is(request)) {
            httpRequestMessage = HttpRequestMessage.constructFromObject(request);
        }
        else {
            httpRequestMessage = request;
        }

        //app.highlight('httpRequestMessage', httpRequestMessage);

        this.send(httpRequestMessage.toBuffer());
        return true;
        
        //var sentMessage = await this.send(messageOrData, correlatingMessage);

        return new Promise(function(resolve, reject) {
            var timeoutFunction = Function.schedule(timeoutInMilliseconds, function() {
                //resolve(new Error('Request failed, timed out after '+timeoutInMilliseconds+' milleseconds.'));
                reject('Request failed, timed out after '+timeoutInMilliseconds+' milleseconds.');
            });

            // A function to check the correlation identifiers of future packets until we get a match
            var correlationIdentifierCheckFunction = function(event) {
                //console.log('HttpConnection.request on data event:', event);
                //console.log('HttpConnection.request on data event.data:', event.data);
                resolve(event.data.toString());
            }.bind(this);

            // Listen to data until we get a response to our request
            this.on('data', correlationIdentifierCheckFunction);
        }.bind(this));
    }

}

// Export
export default HttpConnection;
