// Dependencies
import PacketGenerator from 'framework/system/server/protocols/PacketGenerator.js';
import LocalSocketPacket from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacket.js';
import CyclicRedundancyCheck from 'framework/system/data/CyclicRedundancyCheck.js';

// Class
class LocalSocketPacketGenerator extends PacketGenerator {

    currentIncomingPacketSizeInBytes = null;
    currentIncomingPacketHeader = null;
    currentIncomingPacketHeaderSizeInBytes = 4;
    currentIncomingPacketPayload = null;
    currentIncomingPacketPayloadSizeInBytes = null;
    currentIncomingPacketTrailer = null;
    currentIncomingPacketTrailerSizeInBytes = 4;

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

    emitPacket() {
        if(!this.validCurrentIncomingPacket()) {
            throw new Error('The packet failed the CRC-32 check.');
        }

        var packet = new LocalSocketPacket(this.currentIncomingPacketHeader, this.currentIncomingPacketPayload, this.currentIncomingPacketTrailer);
        //console.log('packet', packet);

        super.emitPacket(packet);

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
export default LocalSocketPacketGenerator;
