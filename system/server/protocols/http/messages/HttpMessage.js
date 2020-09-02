// Dependencies
import { Message } from '@framework/system/server/Message.js';
import { Headers } from '@framework/system/server/protocols/http/messages/headers/Headers.js';
import { Cookies } from '@framework/system/server/protocols/http/messages/headers/Cookies.js';
import { IpAddress } from '@framework/system/network/IpAddress.js';
import { Browser } from '@framework/system/web/Browser.js';
import { Device } from '@framework/system/hardware/Device.js';
import { OperatingSystem } from '@framework/system/operating-system/OperatingSystem.js';
import { Geolocation } from '@framework/system/geolocation/Geolocation.js';
import { Country } from '@framework/system/geolocation/Country.js';
import { Version } from '@framework/system/version/Version.js';
import { Url } from '@framework/system/web/Url.js';

// Class
class HttpMessage extends Message {

    protocol = null;
    protocolVersion = null;
    headers = null;
    cookies = null;
    body = null;
    data = null;
    trailers = null;

    ipAddress = null;
    connectingIpAddress = null;
    
    referrer = null;
	browser = null;
	device = null;
	operatingSystem = null;
    geolocation = null;
    
    time = null;

    constructor(connection = null) {
        super(connection);

        this.time = new Time();

        // Defaults
        this.protocol = 'HTTP';
        this.protocolVersion = new Version('1.1');

        // If a Node connection is set
        if(this.connection) {
            this.protocol = this.connection.protocol;
            this.protocolVersion = this.connection.protocolVersion;    
        }
        
        // Initialize the headers, cookies, and trailers
        this.headers = new Headers();
        this.cookies = new Cookies();
        this.trailers = new Headers();
    }

    setPropertiesUsingHeaders() {
        this.cookies = this.headers.getCookies();
        // app.highlight(this.cookies);

        // Referrer
        let referrerHeader = this.headers.get('referer');
        if(referrerHeader) {
            this.referrerHeader = new Url(referrerHeader);
        }
        
        // Revisit IP address to see if X-Forwarded-For is set
        let xForwardedForHeader = this.headers.get('x-forwarded-for');
        if(xForwardedForHeader) {
            // Catch x.x.x.x,y.y.y.y format
            if(xForwardedForHeader.contains(',')) {
                this.ipAddress = IpAddress.create(xForwardedForHeader.split(',').first());
            }
            else {
                this.ipAddress = IpAddress.create(xForwardedForHeader);	
            }
        }

        // Get the user agent
        let userAgentHeader = this.headers.get('user-agent');

        // Browser identification from user agent
        if(userAgentHeader) {
            this.browser = Browser.fromUserAgent(userAgentHeader);

            // Device identification from user agent
            this.device = Device.fromUserAgent(userAgentHeader);

            // Operating system identification from user agent
            this.operatingSystem = OperatingSystem.fromUserAgent(userAgentHeader);
        }
        
        // Geolocation (optionally provided by Cloudflare) 
        let cloudflareIpCountryCodeHeader = this.headers.get('cf-ipcountry');
        if(cloudflareIpCountryCodeHeader) {
            this.geolocation = new Geolocation();
            this.geolocation.country = new Country();
            this.geolocation.country.code = cloudflareIpCountryCodeHeader;
        }
    }

    static is(value) {
		return Class.isInstance(value, HttpMessage);
    }

    // Set common properties on HttpRequestMessage and HttpResponseMessage
    static applyOptions(httpMessage, options) {
        // Protocol
        if(options.protocol) {
            httpMessage.protocol = options.protocol;
        }
        // Set protocol version from the connection if it exists
        else if(httpMessage.connection && httpMessage.connection.protocol) {
            httpMessage.protocol = httpMessage.connection.protocol;
        }

        // Protocol version
        if(options.protocolVersion) {
            // The protocol version is a Version object
            if(Version.is(options.protocolVersion)) {
                httpMessage.protocolVersion = options.protocolVersion;
            }
            // The protocol version is a string
            else {
                httpMessage.protocolVersion = new Version(options.protocolVersion);
            }
        }
        // Set protocol version from the connection if it exists
        else if(httpMessage.connection && httpMessage.connection.protocolVersion) {
            httpMessage.protocolVersion = httpMessage.connection.protocolVersion;
        }

        // Headers
        if(options.headers) {
            if(Headers.is(options.headers)) {
                httpMessage.headers = options.headers;
            }
            else {
                httpMessage.headers = new Headers(options.headers);
            }
        }

        // Cookies
        if(options.cookies) {
            // Create the headers if we need to
            if(!Headers.is(httpMessage.headers)) {
                httpMessage.headers = new Headers();
            }

            if(Cookies.is(options.cookies)) {
                httpMessage.headers.addCookies(options.cookies);
            }
            else {
                throw new Error('Cookies option must be an instance of class Cookies.');
            }
        }

        // Set other HttpResponseMessage properties from the headers
        httpMessage.setPropertiesUsingHeaders();

        // Body
        if(options.body) {
            httpMessage.body = options.body;

            // If no data is set and the body is JSON
            if(!httpMessage.data && Json.is(httpMessage.body)) {
                httpMessage.data = Json.encode(httpMessage.body);
            }
        }

        // Data
        if(options.data) {
            httpMessage.data = options.data;

            // If no body is set, create it from the data
            if(!httpMessage.body) {
                httpMessage.body = Json.encode(httpMessage.data);
            }
        }

        // Trailers
        if(options.trailers) {
            if(Headers.is(options.trailers)) {
                httpMessage.trailers = options.trailers;
            }
            else {
                httpMessage.trailers = new Headers(options.trailers);
            }
        }

        return httpMessage;
    }
    
}

// Export
export { HttpMessage };
