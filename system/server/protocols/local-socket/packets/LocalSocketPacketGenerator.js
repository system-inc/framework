// Dependencies
import PacketGenerator from 'framework/system/server/protocols/PacketGenerator.js';
import LocalSocketPacket from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacket.js';
import LocalSocketPacketEvent from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacketEvent.js';


// Class
class LocalSocketPacketGenerator extends PacketGenerator {

    constructor() {
        super(LocalSocketPacket);
    }

    emitPacket() {
        //console.log('packet!', this.incomingPacket);
        if(this.incomingPacket.valid()) {
            // Emit the packet
            var data = this.incomingPacket.readPayload();
            //console.log('data', data);
            var correlationIdentifier = this.incomingPacket.readCorrelationIdentifier();
            //console.log('correlationIdentifier', correlationIdentifier);

            var packetEvent = new LocalSocketPacketEvent(this, 'packet', data, correlationIdentifier);
            this.emit('packet', packetEvent);

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
