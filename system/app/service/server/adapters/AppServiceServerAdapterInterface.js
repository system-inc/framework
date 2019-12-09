// Dependencies
import Datastore from 'framework/system/data/datastore/Datastore.js';

// Class
class AppServiceServerAdapterInterface {

    async initialize() {
        return this;
    }

	async createDatastore() {
        return new Datastore();
    }

    async createSessionDatastore() {
        return new Datastore();
    }

}

// Export
export default AppServiceServerAdapterInterface;
