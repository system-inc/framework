// Dependencies
import { Url } from '@framework/system/web/Url.js';
import { BlockchainConnection } from '@framework/system/blockchain/BlockchainConnection.js';

// Class
class Blockchain {

    id = null;
    identifier = null;
    displayTitle = null;
    explorerUrl = null;
    rpcUrl = null;
    averageBlockTimeInMilliseconds = null;
    connection = null;

    constructor(id = null, identifier = null, displayTitle = null, explorerUrl = null, rpcUrl = null, averageBlockTimeInMilliseconds = null) {
        this.id = id;
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

    // Split log data into an array to be used to identify parameters
    static splitHexData(hexData) {
		const splitHexData = [];

		hexData = hexData.substring(2);

		while(hexData.length > 0) {
			splitHexData.push('0x'+hexData.substring(0, 64));
			hexData = hexData.substring(64);
		}

		return splitHexData;
	}

    static constructFromIdentifier(blockchainIdentifier) {
        let blockchain = null;
        let blockchainParameters = Blockchain.blockchains[blockchainIdentifier];

        if(blockchainParameters) {
            blockchain = new Blockchain(blockchainParameters.id, blockchainIdentifier, blockchainParameters.displayTitle, blockchainParameters.explorerUrl, blockchainParameters.rpcUrl, blockchainParameters.averageBlockTimeInMilliseconds);
        }

        return blockchain;
    }

    static constructFromId(blockchainId) {
        let blockchain = null;

        for(let blockchainIdentifier in Blockchain.blockchains) {
            if(Blockchain.blockchains[blockchainIdentifier].id == blockchainId) {
                blockchain = Blockchain.constructFromIdentifier(blockchainIdentifier);
                break;
            }
        }

        // If the blockchain is unknown
        if(blockchain === null) {
            blockchain = Blockchain.constructFromIdentifier('unknown');
            blockchain.id = blockchainId;
        }

        return blockchain;   
    }

    static blockchains = {
        ethereum: {
            id: 1,
            displayTitle: 'Ethereum',
            explorerUrl: new Url('https://etherscan.io/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 15000,
        },
        fantom: {
            id: 250,
            displayTitle: 'Fantom',
            explorerUrl: new Url('https://ftmscan.com/'),
            rpcUrl: new Url('wss://wsapi.fantom.network/'),
            averageBlockTimeInMilliseconds: 1000,
        },
        bnb: {
            id: 56,
            displayTitle: 'BNB',
            explorerUrl: new Url('https://bscscan.com'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        polygon: {
            id: 137,
            displayTitle: 'Polygon',
            explorerUrl: new Url('https://polygonscan.com/'),
            rpcUrl: new Url('wss://matic-mainnet-full-ws.bwarelabs.com/'),
            averageBlockTimeInMilliseconds: 2000,
        },
        polygonMumbai: {
            id: 80001,
            displayTitle: 'Polygon Mumbai Testnet',
            explorerUrl: new Url('https://mumbai.polygonscan.com'),
            rpcUrl: new Url('https://matic-mumbai.chainstacklabs.com	'),
            averageBlockTimeInMilliseconds: 2000,
        },
        moonriver: {
            id: 1285,
            displayTitle: 'Moonriver',
            explorerUrl: new Url('https://blockscout.moonriver.moonbeam.network/'),
            rpcUrl: new Url('wss://wss.api.moonriver.moonbeam.network'),
            averageBlockTimeInMilliseconds: 5000,
        },
        cronos: {
            id: 25,
            displayTitle: 'Cronos',
            explorerUrl: new Url('https://cronos.crypto.org/explorer/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        celo: {
            id: 42220,
            displayTitle: 'Celo',
            explorerUrl: new Url('https://explorer.celo.org/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        arbitrum: {
            id: 42161,
            displayTitle: 'Arbitrum',
            explorerUrl: new Url('https://arbiscan.io/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        harmony: {
            id: 1666600000,
            displayTitle: 'Harmony',
            explorerUrl: new Url('https://explorer.harmony.one/'),
            rpcUrl: new Url('wss://ws.s0.t.hmny.io/'),
            averageBlockTimeInMilliseconds: 5000,
        },
        avalanche: {
            id: 43114,
            displayTitle: 'Avalanche',
            explorerUrl: new Url('https://cchain.explorer.avax.network'),
            rpcUrl: new Url('wss://api.avax.network/ext/bc/C/ws'),
            averageBlockTimeInMilliseconds: 5000,
        },
        fuse: {
            id: 122,
            displayTitle: 'Fuse',
            explorerUrl: new Url('https://explorer.fuse.io/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        metis: {
            id: 1088,
            displayTitle: 'Metis',
            explorerUrl: new Url('https://explorer.celo.org/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        aurora: {
            id: 1313161554,
            displayTitle: 'Aurora',
            explorerUrl: new Url('https://explorer.mainnet.aurora.dev/'),
            rpcUrl: new Url(),
            averageBlockTimeInMilliseconds: 1000,
        },
        gnosis: {
            id: null,
            displayTitle: 'Gnosis',
            explorerUrl: new Url('https://blockscout.com/xdai/mainnet/'),
            rpcUrl: new Url('wss://rpc.gnosischain.com/wss'),
            averageBlockTimeInMilliseconds: 5000,
        },
        pulseChainTestnetV2b: {
            id: 941,
            displayTitle: 'PulseChain Testnet v2b',
            explorerUrl: null,
            rpcUrl: new Url('https://rpc.v2b.testnet.pulsechain.com/	'),
            averageBlockTimeInMilliseconds: 5000,
        },
        unknown: {
            id: null,
            displayTitle: 'Unknown',
            explorerUrl: null,
            rpcUrl: null,
            averageBlockTimeInMilliseconds: null,
        },
    };

}

// Export
export { Blockchain };
