// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class Server extends EventEmitter {

    connections = {};

    stopped = true;

    async initialize() {
        // Stop the server and close all connections when the app is exited
        // TODO: Remove this event listener if the server is already closed
        Node.Process.on('exit', this.stop.bind(this));

        // Start the server
        await this.start();
    }

    async start() {
        this.stopped = false;
    }

    async stop() {
        this.stopped = true;
    }

    async onConnection(connection) {
        this.emit('connection', connection);
    }

    async onDisconnection(connection) {
        this.emit('disconnection', connection);
    }

    async onConnectionData(event) {
        //console.log('Server.onConnectionData event:', event);
        //console.log('Server.onConnectionData event.data:', event.data);
        this.emit('data', event);
    }

    async newConnection(connection) {
        //console.log('Server: Client connected!');
        this.connections[connection.identifier] = connection;
        //console.log('this.connections', this.connections);

        // When the connection receives data
        connection.on('data', this.onConnectionData.bind(this));

        // When the connection is closed
        connection.on('disconnected', function(event) {
            //console.log('Connection disconnected', connection);
            this.removeConnection(connection);
        }.bind(this));

        this.onConnection(connection);

        return connection;
    }

    async removeConnection(connection) {
        this.onDisconnection(connection);
        //console.log('Connection count before delete:', this.connections.getKeys().length);
        //console.log('Deleting connection', connection.identifier);
        this.connections.deleteValueByPath(connection.identifier);
        //console.log('Connection count after delete:', this.connections.getKeys().length);
    }

    // Send data to all connections
    async broadcast(data) {
        //console.log('Broadcasting data', data);
        
        await this.connections.each(async function(connectionIdentifier, connection) {
            await connection.send(data);
        }.bind(this));
    }
	
}

// Export
export default Server;
