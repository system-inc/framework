// Dependencies
import { Connection } from '@framework/system/server/Connection.js';
import { LocalSocketPacketGenerator } from '@framework/system/server/protocols/local-socket/packets/LocalSocketPacketGenerator.js';
import { LocalSocketMessage } from '@framework/system/server/protocols/local-socket/messages/LocalSocketMessage.js';

// Class
class LocalSocketConnection extends Connection {

    packetGenerator = null;

    constructor(nodeSocket) {
        super(nodeSocket);

        // Listen for packets
        this.packetGenerator = new LocalSocketPacketGenerator();
        this.packetGenerator.on('packet', this.onPacket.bind(this));
    }

    // When the Node socket gets data
    onData(data) {
        super.onData(data);

        // Send the data to the packet generator
        this.packetGenerator.receiveDataToProcess(data);
    }

    // When the packet generator generates a packet
    onPacket(event) {
        //console.log('Got a packet event from the socket packet generator', event);
        let packet = event.data;
        
        // Emit a LocalSocketMessage
        let data = packet.readPayload();
        //console.log('LocalSocketConnection onPacket data', data);
        let correlationIdentifier = packet.readCorrelationIdentifier();
        //console.log('LocalSocketConnection onPacket correlationIdentifier', correlationIdentifier);
        let message = new LocalSocketMessage(this, data, correlationIdentifier, packet);
        //console.log('LocalSocketConnection onPacket message', message);

        this.onMessage(message);
    }

    async send(localSocketMessageOrData, correlatingLocalSocketMessage = null) {
        //app.log('LocalSocketConnection send', 'localSocketMessageOrData', localSocketMessageOrData, 'correlatingLocalSocketMessage', correlatingLocalSocketMessage);

        let localSocketMessage = null;

        // If we are sending an existing message
        if(LocalSocketMessage.is(localSocketMessageOrData)) {
            localSocketMessage = localSocketMessageOrData;
        }
        // If we need to create the message
        else {
            localSocketMessage = new LocalSocketMessage(this, localSocketMessageOrData);
        }

        // If there is a correlating message, set the correlation identifier
        if(correlatingLocalSocketMessage !== null) {
            localSocketMessage.correlationIdentifier = correlatingLocalSocketMessage.correlationIdentifier;
        }

        // Send the message's packet over the Node socket
        localSocketMessage.sendPacket(this.nodeSocket);

        // Return the message
        return localSocketMessage;
    }

    async request(localSocketMessageOrData, correlatingLocalSocketMessage = null, timeoutInMilliseconds = 1 * 1000) {
        let sentLocalSocketMessage = await this.send(localSocketMessageOrData, correlatingLocalSocketMessage);

        return new Promise(function(resolve, reject) {
            let timeoutFunction = Function.schedule(timeoutInMilliseconds, function() {
                reject('Request failed, timed out after '+timeoutInMilliseconds+' milleseconds.');
            });

            // A function to check the correlation identifiers of future packets until we get a match
            let correlationIdentifierCheckFunction = function(event) {
                let incomingLocalSocketMessage = event.data;

                // If the correlation identifiers match
                if(incomingLocalSocketMessage.correlationIdentifier == sentLocalSocketMessage.correlationIdentifier) {
                    //console.log('correlationIdentifier matches!', sentLocalSocketMessage.correlationIdentifier);

                    // Cancel the timeout function
                    Function.cancel(timeoutFunction);

                    // When we get the matching message, remove the event listener
                    this.removeEventListener('message', correlationIdentifierCheckFunction);

                    // Return the message
                    resolve(incomingLocalSocketMessage);
                }
                else {
                    //console.log('correlationIdentifier does not match!', 'sentLocalSocketMessage.correlationIdentifier', sentLocalSocketMessage.correlationIdentifier, 'incomingLocalSocketMessage.correlationIdentifier', incomingLocalSocketMessage.correlationIdentifier);
                }
            }.bind(this);

            // Listen to messages until we get a response to our request
            this.on('message', correlationIdentifierCheckFunction);
        }.bind(this));
    }

}

// Export
export { LocalSocketConnection };
