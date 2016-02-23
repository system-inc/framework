WebApi = Class.extend({

    protocol: 'https', // https or http
    host: null,
    port: 80,
    path: null,
    url: null,

    construct: function() {
        this.url = new Url(this.protocol+'://'+this.host+'/'+this.path);
    },

    request: function*(method, path, data, options) {
        //Console.log(method, path, data);

        // Build the URL
        var url = new Url(this.url.toString()+path);
        //Console.log(url.toString());

        // Set the options
        var options = {
            method: method,
            body: data,
        }.merge(options);
        //Console.log(options);

        // Make the request
        var webRequest = new WebRequest(url, options);
        //Console.log('webRequest:', webRequest);
        var webRequestResponse = yield webRequest.execute();
        //Console.log('webRequestResponse:', webRequestResponse);

        return webRequestResponse;
    },
    
});