// Dependencies
import Server from 'framework/system/server/Server.js';
import HttpServerConnection from 'framework/system/server/protocols/http/server/HttpServerConnection.js';

// Class
class HttpServer extends Server {

    nodeServer = null;
    protocol = 'HTTP';
    port = null;
    host = null;

    constructor(port = 8080, host = null) {
        super();

        this.port = port;
        this.host = host;
    }

    async initialize() {
        // Create the Node HTTP server
        this.nodeServer = Node.Http.createServer(this.onNodeServerConnection.bind(this));

        // Super initialize which calls this.start()
        await super.initialize();
    }
    
    async onNodeServerConnection(nodeRequest, nodeResponse) {
        console.log('HttpServer.onNodeServerConnection');
        //console.log('HttpServer onNodeServerConnection nodeRequest', nodeRequest, 'nodeResponse', nodeResponse);
        
        var connection = new HttpServerConnection(nodeRequest.socket, this.protocol, this.port, this.host, nodeRequest, nodeResponse);
        
        // Add the connection to the server
        this.newConnection(connection);

        return connection;
    }

    async start() {
        // If the server is stopped
        if(this.stopped == true) {
            var superStart = super.start.bind(this);

            // Start the server
            await new Promise(function(resolve, reject) {
                this.nodeServer.listen(
                    {
                        port: this.port, // <number>
                        host: this.host, // <string>
                        exclusive: false, // <boolean> If exclusive is false (default), then cluster workers will use the same underlying handle, allowing connection handling duties to be shared. Default: false
                        ipv6Only: false, // <boolean> For TCP servers, setting ipv6Only to true will disable dual-stack support, i.e., binding to host :: won't make 0.0.0.0 be bound. Default: false.
                    },
                    function() {
                        //console.log('HTTP server started: http://'+(this.host ? this.host : '127.0.0.1')+':'+this.port, this.nodeServer);
                        superStart();
                        resolve(true);
                    }.bind(this)
                );
            }.bind(this));
        }
        else {
            return true;
        }
    }

    async stop() {
        //console.log('HttpServer stop()');
        //console.log('HttpServer stop()', new Error().stack);

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
export default HttpServer;
