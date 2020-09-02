// Dependencies
import { EventEmitter } from '@framework/system/event/EventEmitter.js';

// Class
class PacketGenerator extends EventEmitter {

    packetClass = null;
    packetStructureKeys = null;

    currentPacketStructureIndex = null;
    incomingPacket = null;

    dataToProcessSizeInBytes = 0;
    dataToProcess = [];

    packetsEmitted = 0;

    constructor(packetClass) {
        super();

        this.packetClass = packetClass;
        this.packetStructureKeys = this.packetClass.structure.getKeys();
    }
    
    receiveDataToProcess(data) {
        //console.log('Socket packet generator processing data', data.toString());
        
        // We've got new data from the wire, add it to our data to process
        this.dataToProcess.append(data);
        this.dataToProcessSizeInBytes += data.length;

        // Process the data
        this.processData();
    }

    getSizeOfBytesForCurrentPacketStructureIndex() {
        return this.packetClass.structure[this.packetStructureKeys[this.currentPacketStructureIndex]].bytes;
    }

    getSizeOfBytesForCurrentPacketPayload() {
        //console.log('getSizeOfBytesForCurrentPacketPayload');
        var packetSizeInBytes = this.packetClass.readStructure('sizeInBytes', this.incomingPacket);
        //console.log('packetSizeInBytes', packetSizeInBytes);
        var payloadSizeInBytes = packetSizeInBytes;

        // Loop through all of the pieces of the structure and subtract the size of the other pieces
        this.packetClass.structure.each(function(structureKey, structure) {
            if(structure.bytes !== 'n') {
                payloadSizeInBytes -= structure.bytes;
            }
        });

        return payloadSizeInBytes;
    }

    processData() {
        // If the current state index is null, start off with a new packet
        if(this.currentPacketStructureIndex == null) {
            //console.log('Creating a new packet...');
            // Create a new packet
            this.incomingPacket = new this.packetClass();
            
            // Start off at the first structure at index 0
            this.currentPacketStructureIndex = 0;
        }

        // Convenience variables
        var currentPacketStructureKey = this.packetStructureKeys[this.currentPacketStructureIndex];
        //console.log('currentPacketStructureKey', currentPacketStructureKey);
        var sizeOfBytesForCurrentPacketStructure = this.getSizeOfBytesForCurrentPacketStructureIndex();

        // If we are at the payload
        if(sizeOfBytesForCurrentPacketStructure == 'n') {
            // Calculate the size of the payload
            sizeOfBytesForCurrentPacketStructure = this.getSizeOfBytesForCurrentPacketPayload();
        }

        //console.log('sizeOfBytesForCurrentPacketStructure', sizeOfBytesForCurrentPacketStructure);

        // If we have enough bytes for the next structure
        if(this.dataToProcessSizeInBytes >= sizeOfBytesForCurrentPacketStructure) {
            //console.log('We have enough bytes to read', currentPacketStructureKey);

            // Read the bytes into the incoming packet
            this.incomingPacket[currentPacketStructureKey+'Buffer'] = this.readFromDataToProcess(sizeOfBytesForCurrentPacketStructure);

            // Go to the next part of the structure
            this.currentPacketStructureIndex++;

            // If we are at the end of the structure
            if(this.currentPacketStructureIndex > this.packetStructureKeys.length - 1) {
                //console.log('Finished!');
                // We've got a full packet at this point
                this.packetsEmitted++;
                this.emitPacket();
                this.reset();
            }

            // Recurse if there are more bytes to process
            if(this.dataToProcessSizeInBytes > 0) {
                return this.processData();
            }
        }
    }

    readFromDataToProcess(size) {
        var result = null;

        // Keep track of the bytes we are reading
        this.dataToProcessSizeInBytes -= size;

        // If the bytes we want to read are the exact length of the first entry in the dataToProcess array
        if(size === this.dataToProcess[0].length) {
            result = this.dataToProcess.shift();
        }
        // If the bytes we want to read are less than the size of the first entry in the dataToProcess array
        else if(size < this.dataToProcess[0].length) {
            // Cut out just the data we need from the first entry
            result = this.dataToProcess[0].slice(0, size);
            this.dataToProcess[0] = this.dataToProcess[0].slice(size);
        }
        // If the bytes we want to read span more than one entry in the dataToProcess array
        else {
            result = Buffer.allocUnsafe(size);
            var offset = 0;
            var length;

            while(size > 0) {
                length = this.dataToProcess[0].length;

                if(size >= length) {
                    this.dataToProcess[0].copy(result, offset);
                    offset += length;
                    this.dataToProcess.shift();
                }
                else {
                    this.dataToProcess[0].copy(result, offset, 0, size);
                    this.dataToProcess[0] = this.dataToProcess[0].slice(size);
                }

                size -= length;
            }
        }

        return result;
    }

    emitPacket() {
        throw new Error('This method must be implemented by a child class.');
    }

    reset() {
        // Reset the incoming packet
        this.currentPacketStructureIndex = null;
        this.incomingPacket = null;
    }
    
}

// Export
export { PacketGenerator };
