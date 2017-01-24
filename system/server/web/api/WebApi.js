// Dependencies
import Url from 'framework/system/web/Url.js';
import WebRequest from 'framework/system/web/WebRequest.js';

// Class
class WebApi {

    protocol = 'https;, // https or http
    host = null;
    port = 80;
    path = null;
    url = null;

    constructor() {
        this.url = new Url(this.protocol+'://'+this.host+'/'+this.path);
    }

    async request(method, path, data, options) {
        //app.log(method, path, data);

        // Build the URL
        var url = new Url(this.url.toString()+path);
        //app.log(url.toString());

        // Set the options
        var options = {
            method: method,
            body: data,
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
export default WebApi;
