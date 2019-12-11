// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';
import BasicSocketPacket from 'framework/system/server/socket/packets/BasicSocketPacket.js';
import SocketPacketGenerator from 'framework/system/server/socket/packets/SocketPacketGenerator.js';

// Class
class SocketServerClient extends EventEmitter {

    path = null;
    nodeSocket = null;
    socketPacketGenerator = new SocketPacketGenerator();

    connected = false;

    constructor(path = null) {
        super();

        if(path === null) {
            throw new Error('Path must be specified when constructing a SocketServerClient.');
        }
        this.path = path;

        this.socketPacketGenerator.on('packet', this.onPacket.bind(this));

        this.connect();
    }

    connect() {
        //console.log('Client: Connecting...');

        this.nodeSocket = Node.Net.createConnection(this.path);
        this.nodeSocket.on('connected', this.onConnected.bind(this));
        this.nodeSocket.on('disconnected', this.onDisconnected.bind(this));
        this.nodeSocket.on('data', this.onData.bind(this));
    }

    onConnected() {
        //console.log('Client: Connected!');
        this.connected = true;
    }

    // When the node socket gets data
    onData(data) {
        this.socketPacketGenerator.receiveDataToProcess(data);
    }

    // When the socket packet generator generates a packet
    onPacket(event) {
        this.emit('data', event.data.payload);
    }

    send(data) {
        var socketPacket = new BasicSocketPacket(data);
        socketPacket.write(this.nodeSocket);
    }

    disconnect() {
        //console.log('Client: Disconnecting...');
        this.nodeSocket.end();
    }

    onDisconnected() {
        //console.log('Client: Disconnected!');
        this.connected = false;
    }
    
}

// Export
export default SocketServerClient;
