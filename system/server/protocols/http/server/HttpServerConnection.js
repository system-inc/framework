// Dependencies
import HttpConnection from 'framework/system/server/protocols/http/HttpConnection.js';
import HttpRequestMessage from 'framework/system/server/protocols/http/messages/HttpRequestMessage.js';

// Class
class HttpServerConnection extends HttpConnection {

    nodeRequest = null;
    nodeRequestData = [];
    nodeResponse = null;

    constructor(nodeSocket, nodeRequest, nodeResponse) {
        super(nodeSocket);

        this.nodeRequest = nodeRequest;
        this.nodeResponse = nodeResponse;

        this.nodeRequest.on('data', this.onNodeRequestData.bind(this)); // Must bind this event listener or the 'end' event will never trigger
        this.nodeRequest.on('end', this.onNodeRequestEnd.bind(this));
    }

    onNodeRequestData(data) {
        console.log('onNodeRequestData', data.toString());
        this.nodeRequestData.append(data);
    }

    onNodeRequestEnd() {
        console.log('onNodeRequestEnd');

        this.nodeRequestData = Buffer.concat(this.nodeRequestData).toString();

        // Create a message
        var message = HttpRequestMessage.constructFromNodeRequest(this, this.nodeRequest, this.nodeRequestData);

        this.onMessage(message);
    }

}

// Export
export default HttpServerConnection;
