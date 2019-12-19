// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class Server extends EventEmitter {

    identifier = String.uniqueIdentifier();

    connections = {};

    stopped = true;

    nodeProcessExitCallback = null;

    async initialize() {
        // Start the server
        await this.start();
    }

    async start() {
        this.stopped = false;

        // Stop the server and close all connections when the app is exited
        this.nodeProcessExitCallback = function() {
            this.stop();
        }.bind(this);
        Node.Process.on('exit', this.nodeProcessExitCallback);

        this.emit('started');
    }

    async stop() {
        this.stopped = true;

        // Remove the Node process event listener
        Node.Process.removeListener('exit', this.nodeProcessExitCallback);

        this.emit('stopped');
    }

    async onConnection(connection) {
        //console.log('Server.onConnection');
        this.emit('connection', connection);
    }

    async onDisconnection(connection) {
        //console.log('Server.onDisconnection');
        this.emit('disconnection', connection);
    }

    async onConnectionData(data) {
        //console.log('Server.onConnectionData event:', event);
        //console.log('Server.onConnectionData event.data:', event.data);
        this.emit('data', data);
    }

    async onConnectionMessage(message) {
        //console.log('Server.onConnectionMessage event:', event);
        //console.log('Server.onConnectionMessage event.data:', event.data);
        this.emit('message', message);
    }

    async newConnection(connection) {
        //console.log('Server: Client connected!');
        this.connections[connection.identifier] = connection;
        //console.log('this.connections', this.connections);

        // When the connection receives data and messages
        connection.on('data', this.onConnectionData.bind(this));
        connection.on('message', this.onConnectionMessage.bind(this));

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
        //console.log('Connection count before delete:', this.connections.getSize());
        //console.log('Deleting connection', connection.identifier);
        this.connections.deleteValueByPath(connection.identifier);
        //console.log('Connection count after delete:', this.connections.getSize());
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
