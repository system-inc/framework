// Dependencies
import PacketEvent from 'framework/system/server/protocols/PacketEvent.js';

// Class
class LocalSocketPacketEvent extends PacketEvent {

    correlationIdentifier = null;

    constructor(emitter, identifier, data, correlationIdentifier) {
        super(emitter, identifier, data);
        this.correlationIdentifier = correlationIdentifier;
    }

    async respond(data) {
        await this.connection.respond(this.correlationIdentifier, data);
    }

    static is(value) {
		return Class.isInstance(value, LocalSocketPacketEvent);
	}
    
}

// Export
export default LocalSocketPacketEvent;
