// Dependencies
import { EventEmitter } from '@framework/system/event/EventEmitter.js';
import { BlockchainAddress } from '@framework/system/blockchain/BlockchainAddress.js';
import { Blockchain } from '@framework/system/blockchain/Blockchain.js';

// Class
class BlockchainBrowserWallet extends EventEmitter {

    blockchainAddress = null;
    blockchain = null;

    constructor() {
        super();

        if(window.ethereum === undefined) {
            // console.warn('Injected ethereum object not detected.');
            return;
        }

        // Listen for account changes
        ethereum.on('accountsChanged', async function(accounts) {
            // console.log('accountsChanged', accounts);
            if(accounts) {
                this.blockchainAddress = new BlockchainAddress(accounts[0]);
            }
            else {
                this.blockchainAddress = null;
            }
            
            this.emit('blockchainAddressChanged', this.blockchainAddress);
        }.bind(this));

        // Listen for blockchain Changes
        ethereum.on('chainChanged', async function(blockchainId) {
            // console.log('chainChanged', chainId);

            this.blockchain = Blockchain.constructFromId(blockchainId);
            this.emit('blockchainChanged', this.blockchain);
        }.bind(this));
    }

    async connect() {
        // console.log('BlockchainBrowserWallet connect');

        if(BlockchainBrowserWallet.isInstalled()) {
            // Request accounts to initialize the connection to the browser extension
            var accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            // console.log(accounts);

            // Update the blockchain
            this.blockchain = Blockchain.constructFromId(ethereum.chainId);

            if(accounts[0]) {
                this.blockchainAddress = new BlockchainAddress(accounts[0]);
                this.emit('accountChanged', this.blockchainAddress);
            }
        }
    }

    async disconnect() {
        // console.log('BlockchainBrowserWallet disconnect');
        this.blockchainAddress = null;
        this.emit('blockchainAddressChanged', this.blockchainAddress);
    }

    isConnected() {
        return this.blockchainAddress !== null;
    }

    isConnectedToPolygon() {
        // return this.blockchain.id == '0x53b'; // Testing
        return this.blockchain.id == '0x89'; // Polygon
    }

    async getBalance(blockNumber) {
        return await BlockchainBrowserWallet.getBalance(this.blockchainAddress, blockNumber);
    };

    static isInstalled() {
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    }

    static async getBalance(address, blockNumber = 'latest') {
        console.log('getBalance', address, blockNumber);

        var balance = await ethereum.request({
            method: 'eth_getBalance',
            params: [address, blockNumber],
        });

        return BigInt(balance);
    }

}

// Export
export { BlockchainBrowserWallet };
