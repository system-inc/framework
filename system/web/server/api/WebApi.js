// Dependencies
import { Url } from '@framework/system/web/Url.js';
import { WebRequest } from '@framework/system/web/WebRequest.js';

// Class
class WebApi {

    protocol = 'https'; // https or http
    host = null;
    port = 80;
    path = null;
    url = null;
    timeoutInMilliseconds = null;

    constructor(protocol, host, path) {
        if(protocol) {
            this.protocol = protocol;
        }
        if(host) {
            this.host = host;
        }
        if(path) {
            this.path = path;
        }

        var url = this.protocol+'://'+this.host+'/';
        if(this.path) {
            url = url+this.path;
        }

        this.url = new Url(url);
    }

    async request(method, path, data, options) {
        //app.log(method, path, data);

        // Build the URL
        var url = new Url(this.url.toString()+path);
        //console.log('url', url.toString());

        // Set the options
        var options = {
            method: method,
            body: data,
            timeoutInMilliseconds: this.timeoutInMilliseconds,
        }.merge(options);
        //app.log(options);

        // Make the request
        var webRequest = new WebRequest(url, options);
        //app.log('webRequest:', webRequest);
        var webRequestResponse = await webRequest.execute();
        //app.log('webRequestResponse:', webRequestResponse);

        return webRequestResponse;
    }
    
}

// Export
export { WebApi };
