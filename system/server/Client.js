// Dependencies
import { EventEmitter } from '@framework/system/event/EventEmitter.js';

// Class
class Client extends EventEmitter {

    connection = null;

    get connected() {
        var connected = false;

        if(this.connection !== null) {
            connected = this.connection.connected;
        }

        return connected;
    }

    async initialize() {
        this.connection = await this.connect();
        this.connection.on('data', this.onData.bind(this));
        this.connection.on('message', this.onMessage.bind(this));
	}

    async connect() {
        throw new Error('This method must be implemented by a child class, returns an object of type Connection.');
    }

    onData(event) {
        this.emit('data', event);
    }

    onMessage(event) {
        this.emit('message', event);
    }

    // Allow connection calls to be made directly on client

    async send() {
        return this.connection.send.apply(this.connection, arguments);
    }

    async request() {
        return this.connection.request.apply(this.connection, arguments);
    }
    
    async respond() {
        return this.connection.respond.apply(this.connection, arguments);
    }

    async disconnect() {
        return this.connection.disconnect.apply(this.connection, arguments);
    }

}

// Export
export { Client };
