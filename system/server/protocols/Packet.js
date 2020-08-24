// Dependencies


// Class
class Packet {

    readPayload() {
        throw new Error('This method must be implemented by a child class.');
    }

    static structure = null;

    static readStructure(structureKey, packet) {
        var structureType = this.structure[structureKey].type;
        var value = null;
        var buffer = packet[structureKey+'Buffer'];

        if(structureType == 'buffer') {
            value = buffer;
        }
        else if(structureType == 'unsignedInteger8') {
            value = buffer.readUInt8();
        }
        else if(structureType == 'unsignedInteger32BigEndian') {
            value = buffer.readUInt32BE();
        }
        else if(structureType == 'bigUnsignedInteger64BigEndian') {
            value = buffer.readBigUInt64BE();
        }
        else if(structureType == 'string') {
            value = buffer.toString();
        }

        return value;
    }

}

// Export
export { Packet };
