// Dependencies
import HttpConnection from 'framework/system/server/protocols/http/HttpConnection.js';

// Class
class HttpServerConnection extends HttpConnection {

    nodeRequest = null;
    nodeResponse = null;

    constructor(nodeSocket, nodeRequest, nodeResponse) {
        super(nodeSocket);

        this.nodeRequest = nodeRequest;
        this.nodeResponse = nodeResponse;
    }

}

// Export
export default HttpServerConnection;
