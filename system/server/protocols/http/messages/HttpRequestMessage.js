// Dependencies
import HttpMessage from 'framework/system/server/protocols/http/messages/HttpMessage.js';
import Url from 'framework/system/web/Url.js';

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
        httpRequestMessage.method = nodeRequest.method.uppercase();
        httpRequestMessage.url = Url.constructFromNodeRequest(nodeRequest);

        return httpRequestMessage;
    }
    
}

// Export
export default HttpRequestMessage;
