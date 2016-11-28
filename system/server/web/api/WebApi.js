// Dependencies
var Url = Framework.require('framework/system/web/Url.js');
var WebRequest = Framework.require('framework/system/web/WebRequest.js');

// Class
var WebApi = Class.extend({

    protocol: 'https', // https or http
    host: null,
    port: 80,
    path: null,
    url: null,

    construct: function() {
        this.url = new Url(this.protocol+'://'+this.host+'/'+this.path);
    },

    request: function*(method, path, data, options) {
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
        var webRequestResponse = yield webRequest.execute();
        //app.log('webRequestResponse:', webRequestResponse);

        return webRequestResponse;
    },
    
});

// Export
module.exports = WebApi;