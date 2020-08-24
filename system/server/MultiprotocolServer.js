// Dependencies
import { Server } from '@framework/system/server/Server.js';

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

    set connections(connections) {
        // No op, can't set connections on multiprotocol servers
        // Need this defined though, if you define a getter you need to define a setter
    }

    async start() {
        // Start each of the protocol servers
        await this.protocolServers.each(async function(protocolServerIdentifier, protocolServer) {
            await protocolServer.start();
        });

        await super.start();
    }

    async stop() {
        // Stop each of the protocol servers
        await this.protocolServers.each(async function(protocolServerIdentifier, protocolServer) {
            await protocolServer.stop();
        }.bind(this));

        await super.stop();
    }

    async addProtocolServer(protocolServer) {
        // Keep track of the protocol server
        this.protocolServers[protocolServer.identifier] = protocolServer;

        // Protocol server events are emitted from the multiprotocol server
        protocolServer.on('started', this.onProtocolServerStarted.bind(this));
        protocolServer.on('stopped', this.onProtocolServerStopped.bind(this));
        protocolServer.on('connection', this.onConnection.bind(this));
        protocolServer.on('disconnection', this.onDisconnection.bind(this));
        protocolServer.on('data', this.onConnectionData.bind(this));
        protocolServer.on('message', this.onConnectionMessage.bind(this));

        // Initialize the protocol server if it hasn't been initialized
        if(protocolServer.stopped) {
            await protocolServer.initialize();
        }
    }

    async removeProtocolServer(protocolServer) {
        this.protocolServers.deleteValueByPath(protocolServer.identifier);
    }

    async onProtocolServerStarted(event) {
        //console.log('onProtocolServerStarted');
    }

    async onProtocolServerStopped(event) {
        //console.log('onProtocolServerStopped');
        await this.removeProtocolServer(event.emitter);
    }
	
}

// Export
export { MultiprotocolServer };
