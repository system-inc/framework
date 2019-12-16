// Dependencies
import ServerConnection from 'framework/system/server/ServerConnection.js';
import LocalSocketPacketGenerator from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacketGenerator.js';
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
        this.nodeSocket.on('close', this.onNodeSocketClosed.bind(this));

        // Listen for packets
        this.packetGenerator = new LocalSocketPacketGenerator();
        this.packetGenerator.on('packet', this.onPacket.bind(this));
    }

    async send(data, correlationIdentifierString = null) {
        // Create a packet
        var localSocketPacket = LocalSocketPacket.constructFromData(data, correlationIdentifierString);

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
        event.connection = this;
        this.onData(event);
    }

    onNodeSocketClosed(event) {
        this.close();
    }

    close() {
        // Close the Node socket
        this.nodeSocket.destroy();

        // Mark the connection as closed and emit the closed event
        super.close();
    }

}

// Export
export default LocalSocketProtocolServerConnection;
