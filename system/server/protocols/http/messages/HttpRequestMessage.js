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

    toBuffer() {
        console.log(this);

        var string = this.method+' '+this.url.toString()+' '+this.protocol.uppercase()+'/1.1'+"\r\n";
        string += "\r\n\r\n";

        console.log('HttpRequestMessage toBuffer string', string);
        return Buffer.from(string);
    }

    static constructFromNodeRequest(connection, nodeRequest, nodeRequestData) {
        //console.log('nodeRequest', nodeRequest);

        var httpRequestMessage = new HttpRequestMessage(connection);
        
        httpRequestMessage.protocol = connection.protocol;
        httpRequestMessage.majorVersion = nodeRequest.httpVersionMajor;
        httpRequestMessage.minorVersion = nodeRequest.httpVersionMinor;
        httpRequestMessage.headers = nodeRequest.headers;
        httpRequestMessage.body = nodeRequestData;
        httpRequestMessage.trailers = nodeRequest.trailers;
        httpRequestMessage.method = nodeRequest.method.uppercase();
        httpRequestMessage.url = Url.constructFromNodeRequest(nodeRequest);

        return httpRequestMessage;
    }

    static constructFromUrlPath(connection, urlPath) {
        var httpRequestMessage = new HttpRequestMessage(connection);

        httpRequestMessage.method = HttpRequestMessage.methods.get;
        httpRequestMessage.url = new Url(connection.protocol+'://'+connection.host+':'+connection.port+urlPath);

        return httpRequestMessage;
    }

    static constructFromObject(string) {
        var httpRequestMessage = new HttpRequestMessage();

        return httpRequestMessage;
    }

    static methods = {
        get: 'GET',
        head: 'HEAD',
        post: 'POST',
        put: 'PUT',
        delete: 'DELET',
        connect: 'CONNECT',
        options: 'OPTIONS',
        trace: 'TRACE',
        patch: 'PATCH',
    };

    static is(value) {
		return Class.isInstance(value, HttpRequestMessage);
    }
    
}

// Export
export default HttpRequestMessage;
