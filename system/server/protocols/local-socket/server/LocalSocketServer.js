// Dependencies
import { SocketServer } from '@framework/system/server/SocketServer.js';
import { File } from '@framework/system/file-system/File.js';
import { LocalSocketConnection } from '@framework/system/server/protocols/local-socket/LocalSocketConnection.js';

// Class
class LocalSocketServer extends SocketServer {

    localSocketFilePath = null;

    constructor(localSocketFilePath = null) {
        super();

        this.localSocketFilePath = localSocketFilePath;
    }

    async initialize() {
        // Establish the domain socket file
        await this.establishDomainSocketFile();

        // Super initialize which creates the nodeServer and calls this.start()
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
            // console.error('This is not tested, if this works on Windows we can delete this console.error line');
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
        // app.log('LocalSocketServer.onNodeServerConnection');
        let connection = new LocalSocketConnection(nodeSocket);

        // Add the connection to the server
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

}

// Export
export { LocalSocketServer };
