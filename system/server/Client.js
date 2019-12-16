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

    onConnected(event) {
        //console.log('Client: Connected!');
        this.connected = true;
    }

    async disconnect() {
    }

    onDisconnected(event) {
        //console.log('Client: Disconnected!');
        this.connected = false;
    }

    onData(event) {
        this.emit('data', event);
    }

    // Send data to the server with no expectation of a response
    async send(data) {
        throw new Error('This method must be implemented by a child class.');
    }

    // Send data to the server and expect a response
    async request(data) {
        console.error('should I create a LocalSocketProtocolRequest object here and send that?');
        var data = await this.send(data);

        return new Promise(function(resolve, reject) {
            // Listen to data until we get a response to our request
            console.error('This assumes the next packet we get will be the response, I dont think this is true, call tyler about this');
            console.error('I need to put an identifier in the packet and check if the packet is a response and then timeout if I dont get an answer within an expected period?');
            this.once('data', function(event) {
                //console.log('Client.request on data event:', event);
                console.log('Client.request on data event.data:', event.data.toString());

                console.error('Dont return a string, return the raw data')
                resolve(event.data);
                // When we get the event, remove the event listener
                console.log('When we get the event, remove the event listener');
            });
        }.bind(this));
    }
	
}

// Export
export default Client;
