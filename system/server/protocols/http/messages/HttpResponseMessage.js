// Dependencies
import { HttpMessage } from '@framework/system/server/protocols/http/messages/HttpMessage.js';
import { Url } from '@framework/system/web/Url.js';
import { Headers } from '@framework/system/server/protocols/http/messages/headers/Headers.js';
import { Version } from '@framework/system/version/Version.js';

// Class
class HttpResponseMessage extends HttpMessage {

    statusCode = null;
    statusMessage = null;

    static fromNodeResponse(connection, nodeResponse) {
        var httpResponseMessage = new HttpResponseMessage(connection);
        
        httpResponseMessage.protocol = null;
        httpResponseMessage.protocolVersion = null;
        httpResponseMessage.headers = null;
        httpResponseMessage.body = null;
        httpResponseMessage.trailers = null;
        httpResponseMessage.method = null;
        httpResponseMessage.url = null;
        httpResponseMessage.statusCode = null;
        httpResponseMessage.statusMessage = null;

        return httpResponseMessage;
    }

    static fromMethodAndXmlHttpRequest(method, xmlHttpRequest) {
        let httpResponseMessage = new HttpResponseMessage();

        let url = new Url(xmlHttpRequest.responseURL);
        let responseHeaders = xmlHttpRequest.getAllResponseHeaders();
        //console.log('responseHeaders', responseHeaders);
        
        httpResponseMessage.protocol = url.protocol.uppercase();
        httpResponseMessage.protocolVersion = new Version('1.1'); // Default version

        httpResponseMessage.headers = new Headers(responseHeaders);
        httpResponseMessage.body = xmlHttpRequest.response;

        // Decode the body if it is JSON
        if(Json.is(httpResponseMessage.body)) {
            httpResponseMessage.data = Json.decode(httpResponseMessage.body);
        }

        httpResponseMessage.trailers = null;
        httpResponseMessage.method = method.uppercase();
        httpResponseMessage.url = url;
        httpResponseMessage.statusCode = xmlHttpRequest.status;
        httpResponseMessage.statusMessage = xmlHttpRequest.statusText;

        return httpResponseMessage;
    }

    static is(value) {
		return Class.isInstance(value, HttpResponseMessage);
    }
    
}

// Export
export { HttpResponseMessage };
