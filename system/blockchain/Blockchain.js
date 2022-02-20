// Dependencies
import { Url } from '@framework/system/web/Url.js';
import { BlockchainConnection } from '@framework/system/blockchain/BlockchainConnection.js';

// Class
class Blockchain {

    identifier = null;
    displayTitle = null;
    explorerUrl = null;
    rpcUrl = null;
    averageBlockTimeInMilliseconds = null;
    connection = null;

    constructor(identifier = null, displayTitle = null, explorerUrl = null, rpcUrl = null, averageBlockTimeInMilliseconds = null) {
        this.identifier = identifier;
        this.displayTitle = displayTitle;
        this.explorerUrl = explorerUrl;
        this.rpcUrl = rpcUrl;
        this.averageBlockTimeInMilliseconds = averageBlockTimeInMilliseconds;
    }

    createConnection() {
        this.connection = new BlockchainConnection(this);
        return this.connection;
    }

    getExplorerUrl() {
        return Blockchain.getExplorerUrl(this.identifier);
    }

    toObject() {
        var object = {
            identifier: this.identifier,
            displayTitle: this.displayTitle,
            explorerUrl: this.explorerUrl.toString(),
            rpcUrl: this.rpcUrl.toString(),
            averageBlockTimeInMilliseconds: this.averageBlockTimeInMilliseconds,
        };

        return object;
    }

    static getExplorerUrl(blockchainIdentifier) {
        let explorerUrl = null;

        let blockchain = Blockchain.blockchains[blockchainIdentifier];

        if(blockchain) {
            explorerUrl = blockchain.explorerUrl;
        }
        
        return explorerUrl;
    }

    static constructFromIdentifier(blockchainIdentifier) {
        let blockchain = null;
        let blockchainParameters = Blockchain.blockchains[blockchainIdentifier];

        if(blockchainParameters) {
            blockchain = new Blockchain(blockchainIdentifier, blockchainParameters.displayTitle, blockchainParameters.explorerUrl, blockchainParameters.rpcUrl, blockchainParameters.averageBlockTimeInMilliseconds);
        }

        return blockchain;
    }

    static blockchains = {
        ethereum: {
            displayTitle: 'Ethereum',
            explorerUrl: new Url('https://etherscan.io/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 15000,
        },
        fantom: {
            displayTitle: 'Fantom',
            explorerUrl: new Url('https://ftmscan.com/'),
            rpcUrl: new Url('ws://45.79.76.188/9c27f0a6-ws/'),
            averageBlockTimeInMilliseconds: 1000,
        },
        bnb: {
            displayTitle: 'BNB',
            explorerUrl: new Url('https://bscscan.com'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        polygon: {
            displayTitle: 'Polygon',
            explorerUrl: new Url('https://polygonscan.com/'),
            rpcUrl: new Url('wss://matic-mainnet-full-ws.bwarelabs.com/'),
            averageBlockTimeInMilliseconds: 2000,
        },
        moonriver: {
            displayTitle: 'Moonriver',
            explorerUrl: new Url('https://blockscout.moonriver.moonbeam.network/'),
            rpcUrl: new Url('wss://wss.api.moonriver.moonbeam.network'),
            averageBlockTimeInMilliseconds: 5000,
        },
        cronos: {
            displayTitle: 'Cronos',
            explorerUrl: new Url('https://cronos.crypto.org/explorer/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        celo: {
            displayTitle: 'Celo',
            explorerUrl: new Url('https://explorer.celo.org/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        arbitrum: {
            displayTitle: 'Arbitrum',
            explorerUrl: new Url('https://arbiscan.io/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        harmony: {
            displayTitle: 'Harmony',
            explorerUrl: new Url('https://explorer.harmony.one/'),
            rpcUrl: new Url('wss://ws.s0.t.hmny.io/'),
            averageBlockTimeInMilliseconds: 5000,
        },
        avalanche: {
            displayTitle: 'Avalanche',
            explorerUrl: new Url('https://cchain.explorer.avax.network'),
            rpcUrl: new Url('wss://api.avax.network/ext/bc/C/ws'),
            averageBlockTimeInMilliseconds: 5000,
        },
        fuse: {
            displayTitle: 'Fuse',
            explorerUrl: new Url('https://explorer.fuse.io/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        metis: {
            displayTitle: 'Metis',
            explorerUrl: new Url('https://explorer.celo.org/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        aurora: {
            displayTitle: 'Aurora',
            explorerUrl: new Url('https://explorer.mainnet.aurora.dev/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        gnosis: {
            displayTitle: 'Gnosis',
            explorerUrl: new Url('https://blockscout.com/xdai/mainnet/'),
            rpcUrl: new Url('wss://rpc.gnosischain.com/wss'),
            averageBlockTimeInMilliseconds: 5000,
        },
    };

}

// Export
export { Blockchain };
