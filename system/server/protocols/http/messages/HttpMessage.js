// Dependencies
import Message from 'framework/system/server/Message.js';

// Class
class HttpMessage extends Message {

    protocol = null;
    majorVersion = null;
    minorVersion = null;
    headers = {};
    body = null;
    trailers = {};

    constructor(connection, protocol = 'HTTP', majorVersion = 1, minorVersion = 1, headers = {}, body = null, trailers = {}) {
        super(connection);

        this.protocol = protocol;
        this.majorVersion = majorVersion;
        this.minorVersion = minorVersion;
        this.headers = headers;
        this.body = body;
        this.trailers = trailers;
    }
    
}

// Export
export default HttpMessage;
