// Dependencies
import ProtocolClient from 'framework/system/server/protocols/ProtocolClient.js';
import LocalSocketPacket from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacket.js';
import PacketGenerator from 'framework/system/server/protocols/PacketGenerator.js';

// Class
class LocalSocketProtocolClient extends ProtocolClient {

    localSocketFilePath = null;
    nodeSocket = null;
    packetGenerator = new PacketGenerator(LocalSocketPacket);

    constructor(localSocketFilePath = null) {
        super();

        // Set the local socket file path
        if(localSocketFilePath === null) {
            throw new Error('Path must be specified when constructing a LocalSocketProtocolClient.');
        }
        this.localSocketFilePath = localSocketFilePath;

        // Listen for packets from the local socket packet generator
        this.packetGenerator.on('packet', this.onPacket.bind(this));

        // Initialize
        this.initialize();
    }

    async connect() {
        //console.log('Client: Connecting...');
        this.nodeSocket = Node.Net.createConnection(this.localSocketFilePath);
        this.nodeSocket.on('connected', this.onConnected.bind(this));
        this.nodeSocket.on('disconnected', this.onDisconnected.bind(this));
        this.nodeSocket.on('data', this.onNodeSocketData.bind(this));

        await super.connect();
    }

    async disconnect() {
        //console.log('Client: Disconnecting...');
        this.nodeSocket.end();

        await super.disconnect();
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
        this.onData(event.data.payload);
    }

    async send(data) {
        var socketPacket = LocalSocketPacket.constructFromData(data);
        socketPacket.write(this.nodeSocket);

        return socketPacket;
    }
    
}

// Export
export default LocalSocketProtocolClient;
