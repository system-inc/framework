// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class ServerConnection extends EventEmitter {

    server = null;
    identifier = null;

    closed = true;

    constructor(server) {
        super();

        this.server = server;
        this.identifier = String.uniqueIdentifier();
        this.closed = false;
    }

    // Send data to the client with no expectation of a response
    async send(data) {
        throw new Error('This method must be implemented by a child class.');
    }

    // Send data to the client and expect a response
    async request(data) {
        console.error('need to implement')
        // var data = await this.send(data);
        // return data;
    }

    async respond(correlationIdentifier, data) {
        return this.send(data, correlationIdentifier);
    }

    onData(event) {
        this.emit('data', event);
    }

    close() {
        this.closed = true;
        this.emit('closed');
    }
	
}

// Export
export default ServerConnection;
