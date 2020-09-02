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
        
        // If a Node request exists on the connection
        if(this.connection && this.connection.nodeRequest) {
            this.headers = Headers.fromNodeHeaders(this.connection.nodeRequest.headers);
            this.trailers = Headers.fromNodeHeaders(this.connection.nodeRequest.trailers);
        }
        // If no Node connection is set or there is no nodeRequest property on the connection
        else {
            this.headers = new Headers();
            this.trailers = new Headers();
        }

        // Set other HttpMessage properties from the headers
        this.setPropertiesUsingHeaders();
    }

    setPropertiesUsingHeaders() {
        this.cookies = this.headers.getCookies();
        app.highlight(this.cookies);

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
    
}

// Export
export { HttpMessage };
