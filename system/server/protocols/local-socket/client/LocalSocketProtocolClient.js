// Dependencies
import ProtocolClient from 'framework/system/server/protocols/ProtocolClient.js';
import LocalSocketPacket from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacket.js';
import LocalSocketPacketGenerator from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacketGenerator.js';

// Class
class LocalSocketProtocolClient extends ProtocolClient {

    localSocketFilePath = null;
    nodeSocket = null;
    packetGenerator = new LocalSocketPacketGenerator();

    constructor(localSocketFilePath = null) {
        super();

        // Set the local socket file path
        if(localSocketFilePath === null) {
            throw new Error('Path must be specified when constructing a LocalSocketProtocolClient.');
        }
        this.localSocketFilePath = localSocketFilePath;

        // Listen for packets from the local socket packet generator
        this.packetGenerator.on('packet', this.onPacket.bind(this));
    }

    async connect() {
        return new Promise(function(resolve, reject) {
            console.error('need a timeout in case this thing never connects');

            //console.log('Client: Connecting...');
            this.nodeSocket = Node.Net.createConnection(this.localSocketFilePath, function() {
                this.onConnected();
                resolve(true);
            }.bind(this));
            this.nodeSocket.on('disconnected', this.onDisconnected.bind(this));
            this.nodeSocket.on('data', this.onNodeSocketData.bind(this));    
        }.bind(this));
    }

    async disconnect() {
        //console.log('Client: Disconnecting...');
        this.nodeSocket.end();
    }

    // When the Node socket gets data
    onNodeSocketData(data) {
        //console.log('LocalSocketProtocolClient onNodeSocketData data', data);
        this.packetGenerator.receiveDataToProcess(data);
    }

    // When the packet generator generates a packet
    onPacket(event) {
        //console.log('Got a packet event from the socket packet generator', event);
        // Emit a data event
        event.connection = this;
        this.onData(event);
    }

    async send(data) {
        var socketPacket = LocalSocketPacket.constructFromData(data);
        socketPacket.write(this.nodeSocket);

        return socketPacket;
    }

    async request(data, timeoutInMilliseconds = 20 * 1000) {
        var packet = await this.send(data);
        var correlationIdentifier = packet.readCorrelationIdentifier();

        return new Promise(function(resolve, reject) {
            console.error('I need timeouts, see if WebRequest.js or WebServer has the logic already');

            // A function to check the correlation identifiers of future packets until we get a match
            var correlationIdentifierCheckFunction = function(event) {
                //console.log('Client.request on data event:', event);
                //console.log('Client.request on data event.data:', event.data);

                // If the correlation identifiers match
                if(event.correlationIdentifier == correlationIdentifier) {
                    //console.log('correlationIdentifier matches!', correlationIdentifier);

                    // When we get the event, remove the event listener
                    this.removeEventListener('data', correlationIdentifierCheckFunction);

                    // Return the data from the packet
                    resolve(event.data);
                }
                else {
                    //console.log('correlationIdentifier does not match!', 'event.correlationIdentifier', event.correlationIdentifier, 'correlationIdentifier', correlationIdentifier);
                }
            }.bind(this);

            // Listen to data until we get a response to our request
            this.on('data', correlationIdentifierCheckFunction);
        }.bind(this));
    }
    async respond(correlationIdentifier, data) {
        return this.send(data, correlationIdentifier);
    }
    
}

// Export
export default LocalSocketProtocolClient;
