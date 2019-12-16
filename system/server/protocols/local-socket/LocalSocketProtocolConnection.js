// Dependencies
import Connection from 'framework/system/server/Connection.js';
import LocalSocketPacketGenerator from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacketGenerator.js';
import LocalSocketPacket from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacket.js';

// Class
class LocalSocketProtocolConnection extends Connection {

    packetGenerator = null;

    constructor(nodeSocket) {
        super(nodeSocket);

        // Listen for packets
        this.packetGenerator = new LocalSocketPacketGenerator();
        this.packetGenerator.on('packet', this.onPacket.bind(this));
    }

    // When the Node socket gets data
    onNodeSocketData(data) {
        //console.log('Connection.onNodeSocketData', data);

        // Don't emit a data event, instead, send the data to the packet generator
        this.packetGenerator.receiveDataToProcess(data);
    }

    // When the packet generator generates a packet
    onPacket(event) {
        //console.log('Got a packet event from the socket packet generator', event);

        // Emit a data event
        event.connection = this;
        this.onData(event);
    }

    async send(data, correlationIdentifierString = null) {
        // Create a packet
        var localSocketPacket = LocalSocketPacket.constructFromData(data, correlationIdentifierString);

        // Write the packet using the Node socket
        localSocketPacket.write(this.nodeSocket);

        return localSocketPacket;
    }

    async request(data, timeoutInMilliseconds = 1 * 1000) {
        //console.log('LocalSocketProtocolConnection.request data', data);

        var packet = await this.send(data);
        var correlationIdentifier = packet.readCorrelationIdentifier();
        //console.log('LocalSocketProtocolConnection.request packet', correlationIdentifier, data, packet);

        return new Promise(function(resolve, reject) {
            var timeoutFunction = Function.schedule(timeoutInMilliseconds, function() {
                //resolve(new Error('Request failed, timed out after '+timeoutInMilliseconds+' milleseconds.'));
                reject('Request failed, timed out after '+timeoutInMilliseconds+' milleseconds.');
            });

            // A function to check the correlation identifiers of future packets until we get a match
            var correlationIdentifierCheckFunction = function(event) {
                //console.log('LocalSocketProtocolConnection.request on data event:', event);
                //console.log('LocalSocketProtocolConnection.request on data event.data:', event.data);

                // If the correlation identifiers match
                if(event.correlationIdentifier == correlationIdentifier) {
                    //console.log('correlationIdentifier matches!', correlationIdentifier);

                    // Cancel the timeout function
                    Function.cancel(timeoutFunction);

                    // When we get the event, remove the event listener
                    this.removeEventListener('data', correlationIdentifierCheckFunction);

                    // Return the data from the packet
                    resolve(event.data);
                }
                else {
                    //console.log('correlationIdentifier does not match!', 'event.correlationIdentifier', event.correlationIdentifier, 'correlationIdentifier', correlationIdentifier, event.data);
                }
            }.bind(this);

            // Listen to data until we get a response to our request
            this.on('data', correlationIdentifierCheckFunction);
        }.bind(this));
    }

}

// Export
export default LocalSocketProtocolConnection;
