// Globals
// Add functionality to standard JavaScript classes (order of import matters)
import './../../../framework/globals/standard/Promise.js';
import './../../../framework/globals/standard/Number.js';
import './../../../framework/globals/standard/RegularExpression.js';
import './../../../framework/globals/standard/String.js';
import './../../../framework/globals/standard/Array.js';
import './../../../framework/globals/standard/Boolean.js';
// import './../../../framework/globals/standard/errors/Error.js';
// import './../../../framework/globals/standard/Function.js';
// import './../../../framework/globals/standard/Object.js';

// Create Framework custom global classes
// import './../../../framework/globals/custom/Class.js';
import './../../../framework/globals/custom/Json.js';
import './../../../framework/globals/custom/Primitive.js';
import './../../../framework/globals/custom/Time.js';
// import './../../../framework/globals/custom/Decorators.js';

// Dependencies
import { EventEmitter } from './../../../framework/system/event/EventEmitter.js';
import { Url } from './../../../framework/system/web/Url.js';

// Class
class CloudflareWorker extends EventEmitter {

    request = null;
    requestUrl = null;

    environment = null;

    constructor(request, environment) {
        super();

        this.request = request;
        this.requestUrl = new Url(this.request.url);

        this.environment = environment;
    }

    async handleRequest() {
        throw new Error('CloudflareWorker.handleRequest() must be implemented by a subclass.');
    }

}

// Export
export { CloudflareWorker };
