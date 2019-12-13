// Dependencies
import ProtocolClient from 'framework/system/server/protocols/ProtocolClient.js';
import LocalSocketPacket from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacket.js';
import LocalSocketPacketGenerator from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacketGenerator.js';

// Class
class LocalSocketProtocolClient extends ProtocolClient {

    localSocketFilePath = null;
    nodeSocket = null;
    localSocketPacketGenerator = new LocalSocketPacketGenerator();

    constructor(localSocketFilePath = null) {
        super();

        // Set the local socket file path
        if(localSocketFilePath === null) {
            throw new Error('Path must be specified when constructing a LocalSocketProtocolClient.');
        }
        this.localSocketFilePath = localSocketFilePath;

        // Listen for packets from the local socket packet generator
        this.localSocketPacketGenerator.on('packet', this.onPacket.bind(this));

        // Initialize
        this.initialize();
    }

    async connect() {
        //console.log('Client: Connecting...');
        this.nodeSocket = Node.Net.createConnection(this.localSocketFilePath);
        this.nodeSocket.on('connected', this.onConnected.bind(this));
        this.nodeSocket.on('disconnected', this.onDisconnected.bind(this));
        this.nodeSocket.on('data', this.onData.bind(this));

        await super.connect();
    }

    async disconnect() {
        //console.log('Client: Disconnecting...');
        this.nodeSocket.end();

        await super.disconnect();
    }

    // When the Node socket gets data
    onData(data) {
        this.localSocketPacketGenerator.receiveDataToProcess(data);
    }

    // When the socket packet generator generates a packet
    onPacket(event) {
        super.onData(event);
    }

    async send(data) {
        var socketPacket = LocalSocketPacket.constructFromData(data);
        socketPacket.write(this.nodeSocket);
    }

    async request(data) {
        var socketPacket = LocalSocketPacket.constructFromData(data);
        socketPacket.write(this.nodeSocket);
    }    
    
}

// Export
export default LocalSocketProtocolClient;
