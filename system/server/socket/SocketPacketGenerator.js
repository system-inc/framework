// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';
import SocketPacket from 'framework/system/server/socket/SocketPacket.js';

// Class
class SocketPacketGenerator extends EventEmitter {

    processData(data) {
        throw new Error('now just need to implement this! https://medium.com/@nikolaystoykov/build-custom-protocol-on-top-of-tcp-with-node-js-part-1-fda507d5a262');

        console.log('Socket packet generator processing data', data.toString());

        var socketPacket = new SocketPacket(data);
        this.emit('packet', socketPacket);
    }
    
}

// Export
export default SocketPacketGenerator;
