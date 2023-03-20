// Dependencies
import { App } from '@framework/system/app/App.js';

// Class
class CloudflareWorkerApp extends App {

	async fetch(request, environment) {
        throw new Error('CloudflareWorkerApp.fetch() must be implemented by a subclass.');
    }

}

// Export
export { CloudflareWorkerApp };
