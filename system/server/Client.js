// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class Client extends EventEmitter {

    connected = false;

    async initialize() {
		await this.connect();
	}

    async connect() {
    }

    onConnected() {
        //console.log('Client: Connected!');
        this.connected = true;
    }

    async disconnect() {
    }

    onDisconnected() {
        //console.log('Client: Disconnected!');
        this.connected = false;
    }

    onData(data) {
    }

    async send() {
        
    }

    async request() {

    }
	
}

// Export
export default Client;
