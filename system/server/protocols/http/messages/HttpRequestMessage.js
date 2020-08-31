// Dependencies
import { HttpMessage } from '@framework/system/server/protocols/http/messages/HttpMessage.js';
import { Url } from '@framework/system/web/Url.js';
import { Headers } from '@framework/system/server/protocols/http/messages/headers/Headers.js';
import { Version } from '@framework/system/version/Version.js';

// Class
class HttpRequestMessage extends HttpMessage {

    method = null;
    url = null;

    toBuffer() {
        //console.log(this);

        var string = this.method+' '+this.url.toString()+' '+this.protocol.uppercase()+'/1.1'+"\r\n";
        string += "\r\n\r\n";

        //console.log('HttpRequestMessage toBuffer string', string);
        return Buffer.from(string);
    }

    static fromNodeRequest(connection, nodeRequest, nodeRequestData) {
        //console.log('nodeRequest', nodeRequest);

        var httpRequestMessage = new HttpRequestMessage(connection);
        
        httpRequestMessage.protocol = connection.protocol;
        httpRequestMessage.protocolVersion = new Version(nodeRequest.httpVersionMajor+'.'+nodeRequest.httpVersionMinor);
        httpRequestMessage.headers = Headers.fromNodeHeaders(nodeRequest.headers);
        httpRequestMessage.body = nodeRequestData;

        // Decode any data in the body
        if(Json.is(httpRequestMessage.body)) {
            httpRequestMessage.data = Json.decode(httpRequestMessage.body);
        }

        httpRequestMessage.trailers = Headers.fromNodeHeaders(nodeRequest.trailers);
        httpRequestMessage.method = nodeRequest.method.uppercase();
        httpRequestMessage.url = Url.fromNodeRequest(nodeRequest);

        return httpRequestMessage;
    }

    static fromUrlPath(connection, urlPath) {
        var httpRequestMessage = new HttpRequestMessage(connection);

        httpRequestMessage.method = HttpRequestMessage.methods.get;
        httpRequestMessage.url = new Url(connection.protocol+'://'+connection.host+':'+connection.port+urlPath);

        return httpRequestMessage;
    }

    static fromObject(object, url = null) {
        var httpRequestMessage = new HttpRequestMessage();

        httpRequestMessage.protocol = null;

        if(object.headers) {
            if(Headers.is(object.headers)) {
                httpRequestMessage.headers = object.headers;
            }
            else {
                httpRequestMessage.headers = new Headers(object.headers);
            }
        }        

        if(object.body) {
            httpRequestMessage.body = object.body;
        }

        if(object.data) {
            httpRequestMessage.data = object.data;

            // If no body is set, create it from the data
            if(!httpRequestMessage.body) {
                httpRequestMessage.body = Json.encode(httpRequestMessage.data);
            }
        }

        httpRequestMessage.trailers = null;
        
        if(object.method) {
            httpRequestMessage.method = object.method.uppercase();
        }
        else {
            httpRequestMessage.method = HttpRequestMessage.methods.get;
        }

        // Allow URL to be passed in the options instead of the arguments
        if(object.url) {
            url = object.url;
        }

        if(url) {
            if(Url.is(url)) {
                httpRequestMessage.url = url;
            }
            else {
                httpRequestMessage.url = new Url(url);
            }
        }

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
export { HttpRequestMessage };
