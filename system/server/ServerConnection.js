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

    async send() {
        throw new Error('This method must be implemented by a child class.');
    }

    onData(data) {
        this.emit('data', data);
    }

    onClosed(event) {
        this.close();
    }

    close() {
        this.closed = true;
        this.emit('closed', event);
    }
	
}

// Export
export default ServerConnection;
