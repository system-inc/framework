// Dependencies
import { Server } from '@framework/system/server/Server.js';
import { File } from '@framework/system/file-system/File.js';
import { LocalSocketConnection } from '@framework/system/server/protocols/local-socket/LocalSocketConnection.js';

// Class
class LocalSocketServer extends Server {

    nodeServer = null;
    localSocketFilePath = null;

    constructor(localSocketFilePath = null) {
        super();

        this.localSocketFilePath = localSocketFilePath;
    }

    async initialize() {
        // Establish the domain socket file
        await this.establishDomainSocketFile();
        
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

    async establishDomainSocketFile() {
        // If no path was provided, generate a unique one
        if(this.localSocketFilePath === null) {
            // The socket file will be stored in the operating system's temporary directory
            this.localSocketFilePath = Node.Path.join(Node.OperatingSystem.tmpdir(), app.identifier+'-domain-socket-'+String.uniqueIdentifier()+'.socket');
        }
                
        // Handle local domain sockets on Windows using this special path (https://nodejs.org/api/net.html#net_identifying_paths_for_ipc_connections)
        if(app.onWindows()) {
            // TODO: This is not tested
            console.error('This is not tested, if this works on Windows we can delete this console.error line');
            this.localSocketFilePath = Node.Path.join('\\\\?\\pipe', this.localSocketFilePath);
        }
        // Socket files need to be managed on platforms other than Windows
        else {
            var domainSocketFileAlreadyExists = await File.exists(this.localSocketFilePath);
            if(domainSocketFileAlreadyExists) {
                //console.warn('Leftover domain socket file already exists, deleting', this.localSocketFilePath);
                await File.delete(this.localSocketFilePath);
            }
        }

        //console.log('this.localSocketFilePath', this.localSocketFilePath);
    }
    
    onNodeServerConnection(nodeSocket) {
        //console.log('nodeSocket', nodeSocket);
        var connection = new LocalSocketConnection(nodeSocket);
        return this.newConnection(connection);
    }

    async start() {
        // If the server is stopped
        if(this.stopped == true) {
            var superStart = super.start.bind(this);

            // Start the server
            await new Promise(function(resolve, reject) {
                // Domain (file) sockets are much faster than TCP (https://stackoverflow.com/questions/14973942/tcp-loopback-connection-vs-unix-domain-socket-performance)
                this.nodeServer.listen(this.localSocketFilePath, function() {
                    superStart();
                    resolve(true);
                }.bind(this));
            }.bind(this));
        }
        else {
            return true;
        }
    }

    async stop() {
        //console.log('LocalSocketServer stop()');
        //console.log('LocalSocketServer stop()', new Error().stack);

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
export { LocalSocketServer };
