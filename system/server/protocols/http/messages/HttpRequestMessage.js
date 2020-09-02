// Dependencies
import { HttpMessage } from '@framework/system/server/protocols/http/messages/HttpMessage.js';
import { Url } from '@framework/system/web/Url.js';
import { Headers } from '@framework/system/server/protocols/http/messages/headers/Headers.js';
import { Version } from '@framework/system/version/Version.js';

// Class
class HttpRequestMessage extends HttpMessage {

    method = null;
    url = null;

    constructor(connection = null) {
        super(connection);

        // Default to GET
        this.method = HttpRequestMessage.methods.get;
    }

    toBuffer() {
        //console.log('HttpRequestMessage toBuffer string', string);
        return Buffer.from(this.toString());
    }

    toString() {
        // https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html
        // GET url HTTP/1.1
        let string = this.method+' '+this.url.toString()+' '+this.protocol.uppercase()+'/'+this.protocolVersion.major+'.'+this.protocolVersion.minor+"\r\n";

        // A Host header field must be sent in all HTTP/1.1 request messages
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host
        let hostString = this.url.host;
        // Do not add default ports 80 (HTTP) and 443 (HTTPS)
        if(this.url.port != 80 && this.url.port != 443) {
            hostString += ':'+this.url.port;
        }
        this.headers.set('Host', hostString);

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

    // See HttpResponseMessage.fromOptions()
    static fromUrlAndOptions(url, optionsOrHttpRequestMessage, connection = null) {
        // If the passed argument is an HttpRequestMessage
        if(HttpRequestMessage.is(optionsOrHttpRequestMessage)) {
            // Return the HttpRequestMessage
            return optionsOrHttpRequestMessage;
        }

        // Default options
        let options = {
        }.merge(optionsOrHttpRequestMessage);

        // Create the HttpRequestMessage
        let httpRequestMessage = new HttpRequestMessage(connection);

        // Method
        if(options.method) {
            httpRequestMessage.method = options.method.uppercase();
        }

        // URL
        if(Url.is(url)) {
            httpRequestMessage.url = url;
        }
        else {
            httpRequestMessage.url = new Url(url);
        }

        // Protocol
        if(options.protocol) {
            httpRequestMessage.protocol = options.protocol;
        }
        // Set protocol version from the connection if it exists
        else if(connection && connection.protocol) {
            httpRequestMessage.protocol = connection.protocol;
        }

        // Protocol version
        if(options.protocolVersion) {
            // The protocol version is a Version object
            if(Version.is(options.protocolVersion)) {
                httpRequestMessage.protocolVersion = options.protocolVersion;
            }
            // The protocol version is a string
            else {
                httpRequestMessage.protocolVersion = new Version(options.protocolVersion);
            }
        }
        // Set protocol version from the connection if it exists
        else if(connection && connection.protocolVersion) {
            httpRequestMessage.protocolVersion = connection.protocolVersion;
        }

        // Headers
        if(options.headers) {
            if(Headers.is(options.headers)) {
                httpRequestMessage.headers = options.headers;
            }
            else {
                httpRequestMessage.headers = new Headers(options.headers);
            }

            // Set other HttpResponseMessage properties from the headers
            httpRequestMessage.setPropertiesUsingHeaders();
        }

        // Body
        if(options.body) {
            httpRequestMessage.body = options.body;

            // If no data is set and the body is JSON
            if(!httpMessage.data && Json.is(httpMessage.body)) {
                httpMessage.data = Json.encode(httpMessage.body);
            }
        }

        // Data
        if(options.data) {
            httpRequestMessage.data = options.data;

            // If no body is set, create it from the data
            if(!httpRequestMessage.body) {
                httpRequestMessage.body = Json.encode(httpRequestMessage.data);
            }
        }

        // Trailers
        if(options.trailers) {
            if(Headers.is(options.trailers)) {
                httpRequestMessage.trailers = options.trailers;
            }
            else {
                httpRequestMessage.trailers = new Headers(options.trailers);
            }
        }

        return httpRequestMessage;
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

    static is(value) {
		return Class.isInstance(value, HttpRequestMessage);
    }
    
    static methods = {
        get: 'GET',
        head: 'HEAD',
        post: 'POST',
        put: 'PUT',
        delete: 'DELETE',
        connect: 'CONNECT',
        options: 'OPTIONS',
        trace: 'TRACE',
        patch: 'PATCH',
    };

    static structure = {
        'method': {
            type: 'string',
            boundary: ' ',
        },
        'url': {
            type: 'string',
            boundary: ' ',
        },
        'protocol': {
            type: 'string',
            boundary: '/',
        },
        'protocolVersion': {
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
export { HttpRequestMessage };
