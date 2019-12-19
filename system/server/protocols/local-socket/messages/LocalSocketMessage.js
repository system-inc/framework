// Dependencies
import Message from 'framework/system/server/Message.js';
import LocalSocketPacket from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacket.js';

// Class
class LocalSocketMessage extends Message {

    packet = null;
    data = null;
    correlationIdentifier = null;

    constructor(connection, data, correlationIdentifier = null, packet = null) {
        super(connection);

        this.data = data;
        this.correlationIdentifier = correlationIdentifier;
        this.packet = packet;
    }

    getPacket() {
        if(this.packet == null) {
            this.createPacket();
        }

        return this.packet;
    }

    createPacket() {
        this.packet = LocalSocketPacket.constructFromData(this.data, this.correlationIdentifier);

        // Set our correlation identifier created from the packet if we didn't already have one
        if(this.correlationIdentifier === null) {
            this.correlationIdentifier = this.packet.readCorrelationIdentifier();
        }

        return this.packet;
    }

    sendPacket(nodeSocket) {
        this.getPacket().write(nodeSocket);

        return this.packet;
    }
    
    async respond(messageOrData, expectResponse = false) {
        //console.log('LocalSocketMessage respond', messageOrData);
        return this.connection.send(messageOrData, this);
    }

    static async constructFromData(connection, data, correlationIdentifier = null) {
        var localSocketMessage = new LocalSocketMessage(connection, data);
        
        if(correlationIdentifier !== null) {
            localSocketMessage.correlationIdentifier = correlationIdentifier;
        }

        return localSocketMessage;
    }
    
}

// Export
export default LocalSocketMessage;
