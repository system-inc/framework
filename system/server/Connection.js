// Dependencies
import { EventEmitter } from '@framework/system/event/EventEmitter.js';

// Class
class Connection extends EventEmitter {

    identifier = null;
    nodeSocket = null;
    connected = null;

    constructor(nodeSocket) {
        super();

        this.identifier = String.uniqueIdentifier();

        // Configure the Node socket
        this.nodeSocket = nodeSocket;
        this.nodeSocket.on('data', this.onNodeSocketData.bind(this));
        this.nodeSocket.on('close', this.onNodeSocketClosed.bind(this));

        this.connected = true;
    }

    // When the Node socket gets data
    onNodeSocketData(data) {
        //app.log('Connection.onNodeSocketData', data);
        this.onData(data);
    }

    onNodeSocketClosed() {
        app.log('Connection.onNodeSocketClosed');
        this.disconnect();
    }

    onData(data) {
        //app.log('Connection.onData', data);
        this.emit('data', data);
    }

    onMessage(message) {
        // app.log('Connection.onMessage', message);
        this.emit('message', message);
    }

    // Send data to the client with no expectation of a response
    async send() {
        throw new Error('This method must be implemented by a child class.');
    }

    // Send data to the client and expect a response
    async request(timeoutInMilliseconds = 1 * 20000, responseMessageIsForRequestFunction = null) {
        return new Promise(function(resolve, reject) {
            // Fail if the request times out
            let timeoutFunction = Function.schedule(timeoutInMilliseconds, function() {
                reject('Request failed, timed out after '+timeoutInMilliseconds+' milleseconds.');
            });

            // Fail if we are disconnected
            let disconnectedFunction = function() {
                reject('Request failed, disconnected.');
            };
            this.once('disconnected', disconnectedFunction);

            // When we receive a message
            let receiveMessage = function(event) {
                let incomingMessage = event.data;

                // Conditionally validate the message
                if(
                    responseMessageIsForRequestFunction === null || // No validation required, the next message we receive is the right message
                    responseMessageIsForRequestFunction(incomingMessage) === true // The validation succeeded
                ) {
                    // The message is the one we are looking for
                    // app.log('The message we received was the one we are looking for.');

                    // Cancel the timeout function
                    Function.cancel(timeoutFunction);

                    // When we get the response, remove the event listeners
                    this.removeEventListener('disconnected', disconnectedFunction);
                    this.removeEventListener('message', receiveMessage);

                    // Return the HttpMessage
                    resolve(incomingMessage);
                }
                // The message was not the one we were looking for
                else {
                    // app.log('The message we received was not the one we are looking for, waiting for the next message...');
                }
            }.bind(this)

            // Wait until we get a response to our request, the next message will be the response
            this.on('message', receiveMessage);
        }.bind(this));
    }

    // Respond by default just proxies to send, responses do not expect a response
    async respond() {
        return await this.send(...arguments);
    }

    async disconnect() {
        // Mark the connection as closed
        this.connected = false;

        // Emit the disconnected event
        this.emit('disconnected');

        return new Promise(function(resolve, reject) {
            // Close the Node socket
            this.nodeSocket.end(function() {
                resolve(true);
            }.bind(this));           
        }.bind(this));
    }
	
}

// Export
export { Connection };
