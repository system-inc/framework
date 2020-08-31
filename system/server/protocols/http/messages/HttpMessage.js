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

        if(this.connection) {
            this.protocol = connection.protocol;
        }
        
        // this.protocolVersion = new Version({
        //     'major': this.connection.nodeRequest.httpVersionMajor,
        //     'minor': this.connection.nodeRequest.httpVersionMinor,
        // });
        //this.headers = Headers.fromNodeHeaders(this.connection.nodeRequest.headers);
        this.headers = new Headers();
        //this.cookies = new Cookies(this.headers.get('cookie'));
        this.cookies = new Cookies();
        //this.body = body;
        //this.trailers = Headers.fromNodeHeaders(this.connection.nodeRequest.trailers);
        this.trailers = new Headers();

        //this.referrer = new Url(this.headers.get('referer'));

        // Cache the user agent
        //var userAgent = this.headers.get('user-agent');

        // Revisit IP address to see if X-Forwarded-For is set
        // var xForwardedFor = this.headers.get('x-forwarded-for');
        // if(xForwardedFor) {
        //     // Catch x.x.x.x,y.y.y.y format
        //     if(xForwardedFor.contains(',')) {
        //         this.ipAddress = IpAddress.create(xForwardedFor.split(',').first());
        //     }
        //     else {
        //         this.ipAddress = IpAddress.create(xForwardedFor);	
        //     }
        // }

        // Browser identification from user agent
        //this.browser = Browser.fromUserAgent(userAgent);

        // Device identification from user agent
        //this.device = Device.fromUserAgent(userAgent);

        // Operating system identification from user agent
        //this.operatingSystem = OperatingSystem.fromUserAgent(userAgent);

        // Geolocation (optionally provided by Cloudflare)
        //this.geolocation = new Geolocation();
        //this.geolocation.country = new Country();
        //this.geolocation.country.code = this.headers.get('cf-ipcountry');
    }

    static fromNodeRequest() {

    }

    static is(value) {
		return Class.isInstance(value, HttpMessage);
    }
    
}

// Export
export { HttpMessage };
