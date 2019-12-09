// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class Server extends EventEmitter {

    listening = false; // The server is no longer accepting requests
    closed = false; // The server has disconnected all clients and is closed
	
}

// Export
export default Server;
