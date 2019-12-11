// Dependencies
import CyclicRedundancyCheck from 'framework/system/data/CyclicRedundancyCheck.js';

// Class
class BasicSocketPacket {

    header = null; // 4 bytes indicating the total length of the packet
    payload = null; // n bytes containing the payload
    trailer = null; // 4 bytes containing the CRC-32 of the payload

    constructor(data) {
        console.error('after finishing this move abstract stuff to SocketPacketInterface');

        // Create the payload, trailer, and finally the header
        this.createPayload(data);
        this.createTrailer();
        this.createHeader();
    }

    createPayload(data) {
        this.payload = Buffer.from(data);
    }

    createTrailer() {
        this.trailer = CyclicRedundancyCheck.getCrc32AsBuffer(this.payload);
    }

    createHeader() {
        // Allocate two bytes to store the number of bytes in the packet
        this.header = Buffer.alloc(4);

        // Calculate the total number of the bytes in the packet
        var numberOfBytesInPacket = (this.header.length + this.payload.length + this.trailer.length);
        //console.log('numberOfBytesInPacket', numberOfBytesInPacket);

        // Write the total number of bytes in the packet into the header bytes
        this.header.writeUInt16BE(numberOfBytesInPacket);
    }

    write(nodeSocket) {
        // Write the header, payload, and trailer
        nodeSocket.write(this.header);
        nodeSocket.write(this.payload);
        nodeSocket.write(this.trailer);
    }
    
}

// Export
export default BasicSocketPacket;
