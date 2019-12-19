// Dependencies
import Connection from 'framework/system/server/Connection.js';

// Class
class HttpConnection extends Connection {

    constructor(nodeSocket) {
        super(nodeSocket);

        // Listen for packets
        //this.packetGenerator = new LocalSocketPacketGenerator();
        //this.packetGenerator.on('packet', this.onPacket.bind(this));
    }

    // When the Node socket gets data
    onNodeSocketData(data) {
        //console.log('HttpConnection.onNodeSocketData data', data);
        //console.log('HttpConnection.onNodeSocketData data.toString()', data.toString());
        
        this.onData(data);

        // Don't emit a data event, instead, send the data to the packet generator
        //this.packetGenerator.receiveDataToProcess(data);
    }

    LISTEN TO MESSAGE OR PACKET EVENTS NOT DATA EVENTS

    // When the packet generator generates a packet
    onPacket(event) {
        //console.log('Got a packet event from the socket packet generator', event);

        // Emit a data event
        event.connection = this;
        this.onData(event);
    }

    async send(data) {
        //console.log('HttpConnection.send ---');
        //console.log(data);
        //console.log('^ ---');
        this.nodeSocket.write(data);
    }

    async request(data, timeoutInMilliseconds = 1 * 1000) {
        //console.log('HttpConnection.request data', data);

        await this.send(data);
        //console.log('HttpConnection.request packet', correlationIdentifier, data, packet);

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
