// Dependencies
import HttpMessage from 'framework/system/server/protocols/http/messages/HttpMessage.js';

// Class
class HttpResponseMessage extends HttpMessage {

    statusCode = null;
    statusMessage = null;

    constructor(connection) {
        super(connection);
    }

    static constructFromNodeResponse(connection, nodeResponse) {
        var httpResponseMessage = new HttpResponseMessage(connection);
        
        httpResponseMessage.protocol = null;
        httpResponseMessage.majorVersion = null;
        httpResponseMessage.minorVersion = null;
        httpResponseMessage.headers = {};
        httpResponseMessage.body = null;
        httpResponseMessage.trailers = {};
        httpResponseMessage.method = null;
        httpResponseMessage.url = null;
        httpResponseMessage.statusCode = null;
        httpResponseMessage.statusMessage = null;

        return httpResponseMessage;
    }
    
}

// Export
export default HttpResponseMessage;
