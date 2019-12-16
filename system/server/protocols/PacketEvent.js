// Dependencies
import Event from 'framework/system/event/Event.js';

// Class
class PacketEvent extends Event {

    connection = null;

    static is(value) {
        return Class.isInstance(value, PacketEvent);
    }
    
}

// Export
export default PacketEvent;
