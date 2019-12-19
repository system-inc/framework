// Dependencies
import PacketGenerator from 'framework/system/server/protocols/PacketGenerator.js';
import LocalSocketPacket from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacket.js';

// Class
class LocalSocketPacketGenerator extends PacketGenerator {

    constructor() {
        super(LocalSocketPacket);
    }

    emitPacket() {
        //console.log('packet!', this.incomingPacket);
        if(this.incomingPacket.valid()) {
            this.emit('packet', this.incomingPacket);

            // Reset the incoming packet
            this.currentPacketStructureIndex = null;
            this.incomingPacket = null;
        }
        else {
            throw new Error('The packet failed the validation check.', this.incomingPacket);
        }
    }
    
}

// Export
export default LocalSocketPacketGenerator;
