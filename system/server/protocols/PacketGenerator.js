// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';
import LocalSocketPacket from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacket.js';
import CyclicRedundancyCheck from 'framework/system/data/CyclicRedundancyCheck.js';

// Class
class PacketGenerator extends EventEmitter {

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
        throw new Error('This method must be implemented by a child class.');
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

    emitPacket(packet) {
        // Increment packets emitted
        this.packetsEmitted++;

        // Emit the packet
        this.emit('packet', packet);
    }
    
}

// Export
export default PacketGenerator;
