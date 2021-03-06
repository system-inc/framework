// Dependencies
import { HttpMessage } from '@framework/system/server/protocols/http/messages/HttpMessage.js';
import { Url } from '@framework/system/web/Url.js';
import { Headers } from '@framework/system/server/protocols/http/messages/headers/Headers.js';
import { Version } from '@framework/system/version/Version.js';

// Class
class HttpResponseMessage extends HttpMessage {

    statusCode = null;
    statusMessage = null;

    constructor(connection = null) {
        super(connection);

        // Default to 200 OK
        this.statusCode = 200;
        this.statusMessage = 'OK';
    }

    toBuffer() {
        //console.log('HttpResponseMessage toBuffer string', string);
        return Buffer.from(this.toString());
    }

    toString() {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
        // HTTP/1.1 200 OK
        let string = this.protocol.uppercase()+'/'+this.protocolVersion.major+'.'+this.protocolVersion.minor+' '+this.statusCode+' '+this.statusMessage+"\r\n";

        if(this.body) {
            this.headers.set('Content-Length', this.body.sizeInBytes());
        }

        // Headers
        string += this.headers.toString();

        // CRLF
        string += "\r\n";

        // Body
        if(this.body) {
            string += this.body;
        }

        // Trailers
        string += this.trailers.toString();

        return string;
    }

    // See HttpRequestMessage.fromOptions()
    static fromOptions(optionsOrBodyOrHttpResponseMessage, connection = null) {
        // If the passed argument is an HttpResponseMessage
        if(HttpResponseMessage.is(optionsOrBodyOrHttpResponseMessage)) {
            // Return the HttpResponseMessage
            return optionsOrBodyOrHttpResponseMessage;
        }
        // If the passed argument is the response body
        else if(String.is(optionsOrBodyOrHttpResponseMessage)) {
            optionsOrBodyOrHttpResponseMessage = {
                body: optionsOrBodyOrHttpResponseMessage,
            };
        }

        // Default options
        let options = {
        }.merge(optionsOrBodyOrHttpResponseMessage);

        // Create the HttpResponseMessage
        let httpResponseMessage = new HttpResponseMessage(connection);

        // Apply common options
        httpResponseMessage = HttpMessage.applyOptions(httpResponseMessage, options);

        return httpResponseMessage;
    }

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

    static structure = {
        'protocol': {
            type: 'string',
            boundary: '/',
        },
        'protocolVersion': {
            type: 'string',
            boundary: ' ',
        },
        'statusCode': {
            type: 'number',
            boundary: ' ',
        },
        'statusMessage': {
            type: 'string',
            boundary: "\r\n",
        },
        'headers': {
            type: 'string',
            boundary: "\r\n\r\n",
        },
        'body': {
            type: 'string',
            boundary: null,
        },
        'trailers': {
            type: 'string',
            boundary: null,
        },
    };
    
}

// Export
export { HttpResponseMessage };
