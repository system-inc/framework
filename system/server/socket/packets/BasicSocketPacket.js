// Dependencies
import CyclicRedundancyCheck from 'framework/system/data/CyclicRedundancyCheck.js';

// Class
class BasicSocketPacket {

    header = null; // 4 byte buffer indicating the total length of the packet
    payload = null; // n byte buffer containing the payload
    trailer = null; // 4 byte buffer containing the CRC-32 of the payload

    constructor(header, payload, trailer) {
        if(header !== undefined) {
            this.header = header;
        }
        if(payload !== undefined) {
            this.payload = payload;
        }
        if(trailer !== undefined) {
            this.trailer = trailer;
        }
    }

    createPayload(data) {
        // Work with buffers
        if(Buffer.is(data)) {
            this.payload = data;
        }
        else {
            this.payload = Buffer.from(data);
        }
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

    static constructFromData(data) {
        var basicSocketPacket = new BasicSocketPacket();

        // Create the payload, trailer, and finally the header
        basicSocketPacket.createPayload(data);
        basicSocketPacket.createTrailer();
        basicSocketPacket.createHeader();

        return basicSocketPacket;
    }
    
}

// Export
export default BasicSocketPacket;
