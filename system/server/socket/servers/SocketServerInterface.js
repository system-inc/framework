// Dependencies
import Server from 'framework/system/server/Server.js';
import SocketServerConnection from 'framework/system/server/socket/servers/SocketServerConnection.js';

// Class
class SocketServerInterface extends Server {

    nodeServer = null;

    connections = {};

    async initialize() {
        // Create the Node server
        this.nodeServer = Node.Net.createServer(
            {
                allowHalfOpen: false, // Indicates whether half-opened TCP connections are allowed. Default: false
                pauseOnConnect: false, // Indicates whether the socket should be paused on incoming connections. Default: false
            },
            this.onConnection.bind(this)
        );

        await this.start();

        // Stop the server and close all connections when the app is exited
        // TODO: Remove this event listener if the server is already closed
        Node.Process.on('exit', this.close.bind(this));
    }

    async close() {
        if(!this.closed) {
            //console.log('Closing socket server at', this.domainSocketFilePath);
            await new Promise(function(resolve, reject) {
                //console.log('Closing server, no longer accepting new connections...');
                this.nodeServer.close(function() {
                    //console.log('All connections ended and server closed.');
                    this.closed = true;
                    resolve(true);
                }.bind(this));

                // No longer listening
                this.listening = false;
            }.bind(this));
        }
        else {
            return true;
        }
    }

    // Send data to all connections
    broadcast(data) {
        //console.log('Broadcasting data', data);
        this.connections.each(function(identifier, currentSocketServerConnection) {
            currentSocketServerConnection.send(data);
        }.bind(this));
    }

    onConnection(nodeSocket) {
        //console.log('Server: Client connected!');
        //console.log('nodeSocket', nodeSocket);

        var socketServerConnection = new SocketServerConnection(this, nodeSocket);
        socketServerConnection.on('data', this.onConnectionData.bind(this));

        this.connections[socketServerConnection.identifier] = socketServerConnection;
        //console.log('this.connections', this.connections);
    }

    // Triggered any time a packet is received from any connection
    onConnectionData(event) {
        this.emit('data', event); // Emit the event which has references to everything
    }

    removeConnection(identifier) {
        //console.log('Connection count before delete:', this.connections.getKeys().length);
        //console.log('Deleting connection', identifier);
        this.connections.deleteValueByPath(identifier);
        //console.log('Connection count after delete:', this.connections.getKeys().length);
    }

}

// Export
export default SocketServerInterface;
