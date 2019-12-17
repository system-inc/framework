// Dependencies
import Server from 'framework/system/server/Server.js';

// Class
class MultiprotocolServer extends Server {

    protocolServers = {};

    // Accessing multiprotocolServer.connections gets all of the underlying connections
    get connections() {
        var connections = {};
        this.protocolServers.each(function(protocolServerIdentifier, protocolServer) {
            protocolServer.connections.each(function(connectionIdentifier, connection) {
                connections[connectionIdentifier] = connection;
            });
        });

        return connections;
    }

    async start() {
        await super.start();

        await this.protocolServers.each(async function(protocolServerIdentifier, protocolServer) {
            await protocolServer.start();
        });
    }

    async stop() {
        await super.stop();

        await this.protocolServers.each(async function(protocolServerIdentifier, protocolServer) {
            await protocolServer.stop();
        });
    }

    async addProtocolServer(protocolServer) {
        console.error('is the protocol server started and initialized?')

        // Protocol server events are emitted from the multiprotocol server
        protocolServer.on('connection', this.onConnection.bind(this));
        protocolServer.on('disconnection', this.onDisconnection.bind(this));
        protocolServer.on('data', this.onConnectionData.bind(this));

        var protocolServerIdentifier = String.uniqueIdentifier();
        this.protocolServer[protocolServerIdentifier] = protocolServer;
    }

    async removeProtocolServer(protocolServer) {
        this.protocolServers.deleteValueByPath(protocolServer.identifier);
    }
	
}

// Export
export default MultiprotocolServer;
