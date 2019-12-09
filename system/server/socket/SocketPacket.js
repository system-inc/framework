// Dependencies
import CyclicRedundancyCheck from 'framework/system/data/CyclicRedundancyCheck.js';

// Class
class SocketPacket {

    header = null; // 2 bytes indicating the total length of the packet
    payload = null; // n bytes containing the payload
    trailer = null; // 8 bytes containing the hexadecimal crc32 checksum of the payload

    constructor(data) {
        // Create the payload, trailer, and finally the header
        this.createPayload(data);
        this.createTrailer();
        this.createHeader();
    }

    createPayload(data) {
        this.payload = Buffer.from(data);
    }

    createTrailer() {
        var crc32Checksum = CyclicRedundancyCheck.getCrc32Checksum(this.payload);
        this.trailer = Buffer.from(crc32Checksum);
    }

    createHeader() {
        // Allocate two bytes to store the number of bytes in the packet
        this.header = Buffer.allocUnsafe(2);

        // Calculate the total number of the bytes in the packet
        var numberOfBytesInPacket = (this.header.length + this.payload.length + this.trailer.length);
        //console.log('numberOfBytesInPacket', numberOfBytesInPacket);

        // Write the total number of bytes in the packet into the header bytes
        this.header.writeUInt16BE(numberOfBytesInPacket);
    }

    validate() {
        return CyclicRedundancyCheck.checkCrc32(this.payload, this.trailer);
    }

    write(nodeSocket) {
        // Write the header, payload, and trailer
        nodeSocket.write(this.header);
        nodeSocket.write(this.payload);
        nodeSocket.write(this.trailer);
    }
    
}

// Export
export default SocketPacket;
