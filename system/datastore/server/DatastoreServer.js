// Dependencies
import Server from 'framework/system/server/Server.js';
import Datastore from 'framework/system/datastore/Datastore.js';

// Class
class DatastoreServer extends Server {

	datastore = null;
    protocolServers = [];

    constructor(datastore) {
		super();

        this.datastore = datastore;
	}
	
	async initialize() {
		await super.initialize();
	}

	// Allow direct access to the datastore from the DatastoreServer so that DatastoreClients do not need to be created

    async get(path = null) {
		return this.datastore.get.apply(this.datastore, arguments);
	}

	async set(path, value) {
		return this.datastore.set.apply(this.datastore, arguments);
	}

	async delete(path) {
		return this.datastore.delete.apply(this.datastore, arguments);
	}

	async getData() {
		return this.datastore.getData.apply(this.datastore, arguments);
	}

	async setData(data) {
		return this.datastore.setData.apply(this.datastore, arguments);
	}

	async empty() {
		return this.datastore.empty.apply(this.datastore, arguments);
	}

	async merge(data) {
		return this.datastore.merge.apply(this.datastore, arguments);
	}

	async integrate(data) {
		return this.datastore.integrate.apply(this.datastore, arguments);
	}

}

// Export
export default DatastoreServer;
