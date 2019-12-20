// Dependencies
import HttpMessage from 'framework/system/server/protocols/http/messages/HttpMessage.js';

// Class
class HttpRequestMessage extends HttpMessage {

    method = null;
    url = null;

    constructor(connection) {
        super(connection);
    }

    static constructFromNodeRequest(connection, nodeRequest, nodeRequestData) {
        //console.log('nodeRequest', nodeRequest);

        var httpRequestMessage = new HttpRequestMessage(connection);
        
        httpRequestMessage.protocol = 'HTTP';
        httpRequestMessage.majorVersion = nodeRequest.httpVersionMajor;
        httpRequestMessage.minorVersion = nodeRequest.httpVersionMinor;
        httpRequestMessage.headers = nodeRequest.headers;
        httpRequestMessage.body = nodeRequestData;
        httpRequestMessage.trailers = nodeRequest.trailers;
        httpRequestMessage.method = nodeRequest.method;
        httpRequestMessage.url = nodeRequest.url;

        return httpRequestMessage;
    }
    
}

// Export
export default HttpRequestMessage;
