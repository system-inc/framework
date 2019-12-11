// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';
import BasicSocketPacket from 'framework/system/server/socket/packets/BasicSocketPacket.js';
import SocketPacketGenerator from 'framework/system/server/socket/packets/SocketPacketGenerator.js';

// Class
class SocketServerConnection extends EventEmitter {

    socketServer = null;
    nodeSocket = null;
    identifier = null;
    // TODO: Allow users to configure which types of packets to send, such as WebSocketPacket
    socketPacketGenerator = new SocketPacketGenerator();

    constructor(socketServer, nodeSocket) {
        super();

        this.socketServer = socketServer;
        this.nodeSocket = nodeSocket;
        this.identifier = String.uniqueIdentifier();

        this.socketPacketGenerator.on('packet', this.onPacket.bind(this));

        this.nodeSocket.on('data', this.onData.bind(this));
        this.nodeSocket.on('close', this.onClosed.bind(this));
    }

    // Send a packet
    send(data) {
        var socketPacket = new BasicSocketPacket(data);
        socketPacket.write(this.nodeSocket);
    }

    // When the node socket gets data
    onData(data) {
        //console.log('Server received data from a client', data.toString());

        this.socketPacketGenerator.receiveDataToProcess(data);
    }

    // When the socket packet generator generates a packet
    onPacket(event) {
        //console.log('Got a packet event from the socket packet generator', event);
        
        this.emit('data', event.data.payload);
    }

    // Close the socket
    close() {
        this.nodeSocket.close();
    }

    // When the socket is closed
    onClosed() {
        // Remove the connection from the socket server's list of connections
        this.socketServer.removeConnection(this.identifier);
    }

}

// Export
export default SocketServerConnection;
