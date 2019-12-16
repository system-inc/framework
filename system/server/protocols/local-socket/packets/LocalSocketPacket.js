// Dependencies
import Packet from 'framework/system/server/protocols/Packet.js';
import CyclicRedundancyCheck from 'framework/system/data/CyclicRedundancyCheck.js';

// Class
class LocalSocketPacket extends Packet {

    static majorVersion = 1;
    static payloadTypes = [
        'buffer', // 0
        'string', // 1
        'json', // 2
    ];
    static structure = {
        'majorVersion': {
            bytes: 1,
            type: 'unsignedInteger8',
        },
        'sizeInBytes': {
            bytes: 4,
            type: 'unsignedInteger32BigEndian',
        },
        'correlationIdentifier': {
            bytes: 16,
            type: 'string',
        },
        'payloadType': {
            bytes: 1,
            type: 'unsignedInteger8',
        },
        'payload': {
            bytes: 'n',
            type: 'buffer',
        },
        'payloadCrc32': {
            bytes: 4,
            type: 'buffer',
        },
    };

    // The order of the variables below is the structure of the packet
    majorVersionBuffer = null; // 1 byte buffer containing the the major version (0-255) of the packet structure
    sizeInBytesBuffer = null; // 8 byte buffer indicating the total bytes of the packet (2^64 is the max size)
    correlationIdentifierBuffer = null; // 16 byte buffer providing an identifier to correlate requests, responses, and logging
    payloadTypeBuffer = null; // 1 byte buffer describing what type the payload is
    payloadBuffer = null; // n byte buffer containing the payload
    payloadCrc32Buffer = null; // 4 byte buffer containing the CRC-32 of the payload

    createPayloadBuffer(data) {
        // Work with buffers
        if(Buffer.is(data)) {
            this.payloadBuffer = data;
        }
        else {
            this.payloadBuffer = Buffer.from(data);
        }
    }

    createPayloadCrc32Buffer() {
        this.payloadCrc32Buffer = CyclicRedundancyCheck.getCrc32AsBuffer(this.payloadBuffer);
    }

    createMajorVersionBuffer() {
        //console.log('LocalSocketPacket.structure.majorVersion.bytes', LocalSocketPacket.structure.majorVersion.bytes);
        this.majorVersionBuffer = Buffer.alloc(LocalSocketPacket.structure.majorVersion.bytes);
        this.majorVersionBuffer.writeUInt8(LocalSocketPacket.majorVersion); // Version 0
    }

    createCorrelationIdentifierBuffer(correlationIdentifierString = null) {
        if(correlationIdentifierString === null) {
            correlationIdentifierString = String.uniqueIdentifier();
        }

        this.correlationIdentifierBuffer = Buffer.from(correlationIdentifierString);
    }

    createPayloadTypeBuffer(payloadTypeString = null) {
        this.payloadTypeBuffer = LocalSocketPacket.payloadTypeStringToBuffer(payloadTypeString);
    }

    createSizeInBytesBuffer() {
        // Allocate bytes to store the total number of bytes in the packet
        this.sizeInBytesBuffer = Buffer.alloc(LocalSocketPacket.structure.sizeInBytes.bytes);

        // Calculate the total number of the bytes in the packet
        var numberOfBytesInPacket =
            this.majorVersionBuffer.length +
            this.sizeInBytesBuffer.length +
            this.correlationIdentifierBuffer.length +
            this.payloadTypeBuffer.length +
            this.payloadBuffer.length +
            this.payloadCrc32Buffer.length;
        //console.log('numberOfBytesInPacket', numberOfBytesInPacket);

        // Write the total number of bytes in the packet into the sizeInBytes bytes
        this.sizeInBytesBuffer.writeUInt32BE(numberOfBytesInPacket);
    }

    valid() {
        return CyclicRedundancyCheck.checkCrc32(this.payloadBuffer, this.payloadCrc32Buffer);
    }

    write(nodeSocket) {
        // Write out the packet
        nodeSocket.write(this.majorVersionBuffer);
        nodeSocket.write(this.sizeInBytesBuffer);
        nodeSocket.write(this.correlationIdentifierBuffer);
        nodeSocket.write(this.payloadTypeBuffer);
        nodeSocket.write(this.payloadBuffer);
        nodeSocket.write(this.payloadCrc32Buffer);
    }

    readCorrelationIdentifier() {
        return LocalSocketPacket.readStructure('correlationIdentifier', this);
    }

    readPayload() {
        var payloadType = LocalSocketPacket.payloadTypes[LocalSocketPacket.readStructure('payloadType', this)];
        //console.log('payloadType', payloadType);
        var payload = this.payloadBuffer;

        if(payloadType == 'string') {
            payload = payload.toString();
        }
        else if(payloadType == 'json') {
            payload = Json.decode(payload);
        }

        return payload;
    }

    static payloadTypeStringToBuffer(payloadTypeString = null) {
        var payloadTypeIndex = 0;

        if(payloadTypeString == 'string') {
            payloadTypeIndex = 1;
        }
        else if(payloadTypeString == 'json') {
            payloadTypeIndex = 2;
        }

        var payloadTypeBuffer = Buffer.alloc(LocalSocketPacket.structure.payloadType.bytes);
        payloadTypeBuffer.writeUInt8(payloadTypeIndex);

        return payloadTypeBuffer;
    }

    static constructFromData(data, correlationIdentifierString = null) {
        var localSocketPacket = new LocalSocketPacket();

        // Create the major version
        localSocketPacket.createMajorVersionBuffer();

        // Create the correlation identifier
        localSocketPacket.createCorrelationIdentifierBuffer(correlationIdentifierString);

        // Create the payload type and encode the data
        var payloadTypeString = 'buffer';
        if(String.is(data)) {
            payloadTypeString = 'string';
            data = Buffer.from(data);
        }
        if(Object.is(data)) {
            payloadTypeString = 'json';
            data = Json.encode(data);
        }

        localSocketPacket.createPayloadTypeBuffer(payloadTypeString);

        // Create the payload
        localSocketPacket.createPayloadBuffer(data);

        // Create the payload CRC-32
        localSocketPacket.createPayloadCrc32Buffer();

        // Lastly, calculate the size in bytes
        localSocketPacket.createSizeInBytesBuffer();

        return localSocketPacket;
    }
    
}

// Export
export default LocalSocketPacket;
