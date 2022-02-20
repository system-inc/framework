// Dependencies
import { EventEmitter } from '@framework/system/event/EventEmitter.js';

// Class
class BlockchainConnection extends EventEmitter {

    blockchain = null;
    web3 = null;
    
    constructor(blockchain) {
        super();

        this.blockchain = blockchain;

        this.web3 = new Web3(
            new Web3.providers.WebsocketProvider(this.blockchain.rpcUrl.toString(), {
                // Auto reconnect if connection is lost
                reconnect: {
                    auto: true,
                    delay: 20000, // ms
                    maxAttempts: 999,
                    onTimeout: false,
                },
            })
        );
    }

    // Split log data into an array to be used to identify parameters
    splitLogData(logData) {
		const splitLogData = [];

		logData = logData.substring(2);

		while(logData.length > 0) {
			splitLogData.push('0x'+logData.substring(0, 64));
			logData = logData.substring(64);
		}

		return splitLogData;
	}

    subscribeToBlocks() {
        // console.log('Subscribing to block headers...');

		this.web3.eth.subscribe('newBlockHeaders').on('data', function(blockHeader) {
            // console.log('blockHeader', blockHeader);
			this.emit('block', blockHeader);
		}.bind(this));
	}

}

// Export
export { BlockchainConnection };
