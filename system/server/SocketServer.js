// Dependencies
import { Server } from '@framework/system/server/Server.js';

// Class
class SocketServer extends Server {

    nodeServer = null;

    async initialize() {
        // Create the Node server
        this.nodeServer = Node.Net.createServer(
            {
                allowHalfOpen: false, // Indicates whether half-opened TCP connections are allowed. Default: false
                pauseOnConnect: false, // Indicates whether the socket should be paused on incoming connections. Default: false
            },
            this.onNodeServerConnection.bind(this)
        );

        // Super initialize which calls this.start()
        await super.initialize();
    }

    onNodeServerConnection() {
        throw new Error('Must be implemented by a child class.');
    }

    async stop() {
        // If the server is not already stopped
        if(!this.stopped) {
            var superStop = super.stop.bind(this);

            //console.log('Closing socket server at', this.localSocketFilePath);
            await new Promise(function(resolve, reject) {
                //console.log('Closing server, no longer accepting new connections...');
                
                // This just stops new connections from connecting
                this.nodeServer.close(function() {
                    //console.log('All connections closed and server stopped.');
                    superStop();
                    resolve(true);
                }.bind(this));

                // Loop through each connection and disconnect it
                this.connections.each(function(identifier, connection) {
                    //console.log('connection', connection);
                    connection.disconnect();
                });

                // No longer listening
                this.listening = false;
            }.bind(this));
        }
        else {
            return true;
        }
    }

}

// Export
export { SocketServer };
