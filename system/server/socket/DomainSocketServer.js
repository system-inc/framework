// Dependencies
import SocketServerInterface from 'framework/system/server/socket/SocketServerInterface.js';
import File from 'framework/system/file-system/File.js';

// Class
/*
    https://en.wikipedia.org/wiki/Unix_domain_socket
*/
class DomainSocketServer extends SocketServerInterface {

    domainSocketFilePath = null;

    constructor(domainSocketFilePath = null) {
        super();

        if(domainSocketFilePath !== null) {
            this.domainSocketFilePath = domainSocketFilePath;
        }
    }

    async initialize() {
        await this.establishDomainSocketFile();
        await super.initialize();
    }

    async establishDomainSocketFile() {
        // If no path was provided, generate a unique one
        if(this.domainSocketFilePath === null) {
            // The socket file will be stored in the operating system's temporary directory
            this.domainSocketFilePath = Node.Path.join(Node.OperatingSystem.tmpdir(), app.identifier+'-domain-socket-'+String.uniqueIdentifier()+'.socket');
        }
                
        // Handle local domain sockets on Windows using this special path (https://nodejs.org/api/net.html#net_identifying_paths_for_ipc_connections)
        if(app.onWindows()) {
            // TODO: This is not tested
            console.error('This is not tested, if this works on Windows we can delete this console.error line');
            this.domainSocketFilePath = Node.Path.join('\\\\?\\pipe', this.domainSocketFilePath);
        }
        // Socket files need to be managed on platforms other than Windows
        else {
            var domainSocketFileAlreadyExists = await File.exists(this.domainSocketFilePath);
            if(domainSocketFileAlreadyExists) {
                //console.warn('Leftover domain socket file already exists, deleting', this.domainSocketFilePath);
                await File.delete(this.domainSocketFilePath);
            }
        }

        //console.log('this.domainSocketFilePath', this.domainSocketFilePath);
    }

    async start() {
        // Start the server
        await new Promise(function(resolve, reject) {
            // Domain (file) sockets are much faster than TCP (https://stackoverflow.com/questions/14973942/tcp-loopback-connection-vs-unix-domain-socket-performance)
            this.nodeServer.listen(this.domainSocketFilePath, function() {
                this.listening = true;
                this.closed = false;
                resolve(true);
            }.bind(this));
        }.bind(this));
    }

}

// Export
export default DomainSocketServer;
