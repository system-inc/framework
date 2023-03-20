// Dependencies
import { App } from '@framework/system/app/App.js';
import { Url } from '@framework/system/web/Url.js';

// Class
class CloudflareWorkerApp extends App {

    request = null;
    requestUrl = null;
    environment = null;
    context = null;

    responseBody = null;
    responseStatus = 200;
    responseStatusText = 'OK';
    responseHeaders = {
        'content-type': 'text/html;charset=UTF-8',
    };
    
    async fetch(request, environment, context) {
        // console.log('fetch');

        this.request = request;
        this.requestUrl = new Url(request.url);
        this.environment = environment;
        this.context = context;

        // Defaults
        this.responseBody = null;
        this.responseStatus = 200;
        this.responseStatusText = 'OK';
        this.responseHeaders = {
            'content-type': 'text/html;charset=UTF-8',
        };

        return await this.handleRequest();
    }

	async handleRequest() {
        throw new Error('CloudflareWorkerApp.handleRequest() must be implemented by a subclass.');
    }

}

// Export
export { CloudflareWorkerApp };
