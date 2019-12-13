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
        //console.log('Server: Client connected!');
        this.connections[connection.identifier] = connection;
        //console.log('this.connections', this.connections);

        // When the connection receives data
        connection.on('data', this.onConnectionData.bind(this));

        // When the connection is closed
        connection.on('close', function(event) {
            this.removeConnection(connection);
        }.bind(this));
    }

    async onConnectionData(data) {
        this.emit('data', data);
    }

    async removeConnection(connection) {
        //console.log('Connection count before delete:', this.connections.getKeys().length);
        //console.log('Deleting connection', connection.identifier);
        this.connections.deleteValueByPath(connection.identifier);
        //console.log('Connection count after delete:', this.connections.getKeys().length);
    }

    // Send data to all connections
    async broadcast(data) {
        //console.log('Broadcasting data', data);
        
        await this.connections.each(async function(identifier, currentConnection) {
            await currentConnection.send(data);
        }.bind(this));
    }
	
}

// Export
export default Server;
