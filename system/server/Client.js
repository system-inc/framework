// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class Client extends EventEmitter {

    connected = false;

    async initialize() {
		await this.connect();
	}

    async connect() {
        throw new Error('This method must be implemented by a child class.');
    }

    onConnected(event) {
        //console.log('Client: Connected!');
        this.connected = true;
    }

    async disconnect() {
        throw new Error('This method must be implemented by a child class.');
    }

    onDisconnected(event) {
        //console.log('Client: Disconnected!');
        this.connected = false;
    }

    onData(event) {
        this.emit('data', event);
    }

    // Send data to the server with no expectation of a response, return the packet
    async send(data) {
        throw new Error('This method must be implemented by a child class, must return an object of type Packet.');
        //return packet;
    }

    // Send data to the server and expect a response, return the response
    async request(data) {
        throw new Error('This method must be implemented by a child class.');
    }

}

// Export
export default Client;
