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
    async request() {
        throw new Error('This method must be implemented by a child class.');
    }

    // Respond by default just proxies to request
    async respond() {
        return await this.request(...arguments);
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
