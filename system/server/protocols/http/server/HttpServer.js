// Dependencies
import { SocketServer } from '@framework/system/server/SocketServer.js';
import { HttpConnection } from '@framework/system/server/protocols/http/HttpConnection.js';
import { Version } from '@framework/system/version/Version.js';

/*
    Notes - see HttpClient.js
    This is a simple implementation of an HTTP 1.1 server using plain sockets.
    As I want to learn more about the different features of the HTTP protocol, I can implement them
    and test them with HttpProtocolTest.js

    Some things I can work on next:
    gzipping content
    HttpServer
    HTTP 2.0
*/

// Class
class HttpServer extends SocketServer {

    protocol = HttpServer.protocols.http;
    protocolVersion = new Version('1.1');
    port = null;
    host = null;

    constructor(port = 8080, host = '127.0.0.1', protocol = null, protocolVersion = null) {
        super();

        this.port = port;
        this.host = host;

        if(protocol) {
            this.protocol = protocol;
        }

        if(protocolVersion) {
            this.protocolVersion = protocolVersion;
        }
    }
    
    onNodeServerConnection(nodeSocket) {
        // app.log('HttpServer.onNodeServerConnection');
        let connection = new HttpConnection(nodeSocket, this.protocol, this.protocolVersion, this.port, this.host);
        
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

    static protocols = {
        http: 'HTTP',
        https: 'HTTPS',
    };

}

// Export
export { HttpServer };
