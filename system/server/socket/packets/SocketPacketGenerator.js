// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';
import BasicSocketPacket from 'framework/system/server/socket/packets/BasicSocketPacket.js';
import CyclicRedundancyCheck from 'framework/system/data/CyclicRedundancyCheck.js';

// Class
class SocketPacketGenerator extends EventEmitter {

    currentIncomingPacketSizeInBytes = null;
    currentIncomingPacketHeader = null;
    currentIncomingPacketHeaderSizeInBytes = 4;
    currentIncomingPacketPayload = null;
    currentIncomingPacketPayloadSizeInBytes = null;
    currentIncomingPacketTrailer = null;
    currentIncomingPacketTrailerSizeInBytes = 4;
    
    dataToProcessSizeInBytes = 0;
    dataToProcess = [];
    dataToProcessState = null; // null, header, payload, trailer

    packetsEmitted = 0;
    
    receiveDataToProcess(data) {
        //console.log('Socket packet generator processing data', data.toString());
        
        // We've got new data from the wire, add it to our data to process
        this.dataToProcess.append(data);
        this.dataToProcessSizeInBytes += data.length;

        // Process the data
        this.processData();
    }

    processData() {
        // If the current state is null, then try to read the header
        if(this.dataToProcessState == null) {
            // Set the current state to header
            this.dataToProcessState = 'header';

            // If we have enough bytes for the header
            if(this.dataToProcessSizeInBytes >= this.currentIncomingPacketHeaderSizeInBytes) {
                this.currentIncomingPacketHeader = this.readFromDataToProcess(this.currentIncomingPacketHeaderSizeInBytes);
                this.currentIncomingPacketSizeInBytes = this.currentIncomingPacketHeader.readUInt16BE(0, true);
                //console.log('this.currentIncomingPacketSizeInBytes', this.currentIncomingPacketSizeInBytes);
                
                this.currentIncomingPacketPayloadSizeInBytes = this.currentIncomingPacketSizeInBytes - this.currentIncomingPacketHeaderSizeInBytes - this.currentIncomingPacketTrailerSizeInBytes;
                //console.log('this.currentIncomingPacketPayloadSizeInBytes', this.currentIncomingPacketPayloadSizeInBytes);

                // Switch state to payload
                this.dataToProcessState = 'payload';
            }
        }

        // If the current state is payload and we have enough bytes for the payload
        if(this.dataToProcessState == 'payload' && (this.dataToProcessSizeInBytes >= this.currentIncomingPacketPayloadSizeInBytes)) {
            this.currentIncomingPacketPayload = this.readFromDataToProcess(this.currentIncomingPacketPayloadSizeInBytes);
            //console.log('this.currentIncomingPacketPayload', this.currentIncomingPacketPayload);
            this.dataToProcessState = 'trailer';
        }

        // If the current state is trailer and we have enough bytes for the trailer
        if(this.dataToProcessState == 'trailer' && (this.dataToProcessSizeInBytes >= this.currentIncomingPacketTrailerSizeInBytes)) {
            this.currentIncomingPacketTrailer = this.readFromDataToProcess(this.currentIncomingPacketTrailerSizeInBytes);
            //console.log('this.currentIncomingPacketTrailer', this.currentIncomingPacketTrailer);

            // We've got a full packet at this point
            this.emitPacket();

            this.dataToProcessState = null;
        }

        // Call process data again if there is more to process
        if(this.dataToProcessState == null && this.dataToProcessSizeInBytes >= this.currentIncomingPacketHeaderSizeInBytes) {
            //console.log('Still more data to process!', this.dataToProcessSizeInBytes);
            this.processData();
        }
    }

    readFromDataToProcess(size) {
        var result = null;

        // Keep track of the bytes we are reading
        this.dataToProcessSizeInBytes -= size;

        // If the bytes we want to read are the exact length of the first entry in the data to process array
        if(size === this.dataToProcess[0].length) {
            result = this.dataToProcess.shift();
        }
        // If the bytes we want to read are less than the size of the first entry in the data to process array
        else if(size < this.dataToProcess[0].length) {
            // Cut out just the data we need from the first entry
            result = this.dataToProcess[0].slice(0, size);
            this.dataToProcess[0] = this.dataToProcess[0].slice(size);
        }
        // If the bytes we want to read span more than one entry in the data to process array
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
        if(!this.validCurrentIncomingPacket()) {
            throw new Error('The packet failed the CRC-32 check.');
        }

        // Increment packets emitted
        this.packetsEmitted++;

        var socketPacket = new BasicSocketPacket(this.currentIncomingPacketHeader, this.currentIncomingPacketPayload, this.currentIncomingPacketTrailer);
        //console.log('socketPacket', socketPacket);

        // Emit the packet
        this.emit('packet', socketPacket);

        // Reset the current incoming packet properties
        this.currentIncomingPacketSizeInBytes = null;
        this.currentIncomingPacketHeader = null;
        this.currentIncomingPacketHeaderSizeInBytes = 4;
        this.currentIncomingPacketPayload = null;
        this.currentIncomingPacketPayloadSizeInBytes = null;
        this.currentIncomingPacketTrailer = null;
        this.currentIncomingPacketTrailerSizeInBytes = 4;
    }

    validCurrentIncomingPacket() {
        return CyclicRedundancyCheck.checkCrc32(this.currentIncomingPacketPayload, this.currentIncomingPacketTrailer);
    }
    
}

// Export
export default SocketPacketGenerator;
