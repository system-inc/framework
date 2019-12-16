// Dependencies
import ServerConnection from 'framework/system/server/ServerConnection.js';
import PacketGenerator from 'framework/system/server/protocols/PacketGenerator.js';
import LocalSocketPacket from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacket.js';

// Class
class LocalSocketProtocolServerConnection extends ServerConnection {

    nodeSocket = null;
    packetGenerator = null;

    constructor(server, nodeSocket) {
        super(server);

        // Configure the Node socket
        this.nodeSocket = nodeSocket;
        this.nodeSocket.on('data', this.onNodeSocketData.bind(this));
        this.nodeSocket.on('close', this.onClosed.bind(this));

        // Listen for packets
        this.packetGenerator = new PacketGenerator(LocalSocketPacket);
        this.packetGenerator.on('packet', this.onPacket.bind(this));
    }

    async send(data) {
        // Create a packet
        var localSocketPacket = LocalSocketPacket.constructFromData(data);

        // Write the packet using the Node socket
        localSocketPacket.write(this.nodeSocket);
    }

    // When the Node socket gets data
    onNodeSocketData(data) {
        //console.log('Server received data from a client', data.toString());

        // Don't emit a data event, instead, send the data to the packet generator
        this.packetGenerator.receiveDataToProcess(data);
    }

    // When the packet generator generates a packet
    onPacket(event) {
        //console.log('Got a packet event from the socket packet generator', event);
        // Emit a data event
        this.onData(event.data);
    }

    close() {
        // Close the Node socket
        this.nodeSocket.close();

        // Mark the connection as closed and emit the closed event
        super.close();
    }

}

// Export
export default LocalSocketProtocolServerConnection;
