// Dependencies
import Connection from 'framework/system/server/Connection.js';
import LocalSocketPacketGenerator from 'framework/system/server/protocols/local-socket/packets/LocalSocketPacketGenerator.js';

import LocalSocketMessage from 'framework/system/server/protocols/local-socket/messages/LocalSocketMessage.js';
import Message from '../../Message';

// Class
class LocalSocketProtocolConnection extends Connection {

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
        var packet = event.data;
        
        // Emit a LocalSocketMessage
        var data = packet.readPayload();
        //console.log('LocalSocketConnection onPacket data', data);
        var correlationIdentifier = packet.readCorrelationIdentifier();
        //console.log('LocalSocketConnection onPacket correlationIdentifier', correlationIdentifier);
        var message = new LocalSocketMessage(this, data, correlationIdentifier, packet);
        //console.log('LocalSocketConnection onPacket message', message);

        this.onMessage(message);
    }

    async send(messageOrData, correlatingMessage = null) {
        //console.log('LocalSocketConnection send', 'messageOrData', messageOrData, 'correlatingMessage', correlatingMessage);

        var message = null;

        // If we are sending an existing message
        if(Message.is(messageOrData)) {
            message = messageOrData;
        }
        // If we need to create the message
        else {
            message = new LocalSocketMessage(this, messageOrData);
        }

        // If there is a correlating message, set the correlation identifier
        if(correlatingMessage !== null) {
            message.correlationIdentifier = correlatingMessage.correlationIdentifier;
        }

        // Send the message's packet over the Node socket
        message.sendPacket(this.nodeSocket);

        // Return the message
        return message;
    }

    async request(messageOrData, timeoutInMilliseconds = 1 * 1000) {
        var sentMessage = await this.send(messageOrData);

        return new Promise(function(resolve, reject) {
            var timeoutFunction = Function.schedule(timeoutInMilliseconds, function() {
                //resolve(new Error('Request failed, timed out after '+timeoutInMilliseconds+' milleseconds.'));
                reject('Request failed, timed out after '+timeoutInMilliseconds+' milleseconds.');
            });

            // A function to check the correlation identifiers of future packets until we get a match
            var correlationIdentifierCheckFunction = function(event) {
                var incomingMessage = event.data;

                // If the correlation identifiers match
                if(incomingMessage.correlationIdentifier == sentMessage.correlationIdentifier) {
                    //console.log('correlationIdentifier matches!', sentMessage.correlationIdentifier);

                    // Cancel the timeout function
                    Function.cancel(timeoutFunction);

                    // When we get the event, remove the event listener
                    this.removeEventListener('data', correlationIdentifierCheckFunction);

                    // Return the message
                    resolve(incomingMessage);
                }
                else {
                    //console.log('correlationIdentifier does not match!', 'sentMessage.correlationIdentifier', sentMessage.correlationIdentifier, 'incomingMessage.correlationIdentifier', incomingMessage.correlationIdentifier);
                }
            }.bind(this);

            // Listen to messages until we get a response to our request
            this.on('message', correlationIdentifierCheckFunction);
        }.bind(this));
    }

}

// Export
export default LocalSocketProtocolConnection;
