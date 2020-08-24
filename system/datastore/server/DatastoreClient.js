// Dependencies
import { Client } from '@framework/system/server/Client.js';
//import { LocalSocketProtocolClient } from '@framework/system/server/protocols/local-socket/client/LocalSocketProtocolClient.js';

// Class
class DatastoreClient extends Client {

	protocolClient = null;

	constructor(protocolClient) {
		super();

		this.protocolClient = protocolClient;
	}

	async initialize() {
		//this.protocolClient = new LocalSocketProtocolClient();

		await super.initialize();
	}

    async connect() {
        
    }

    async disconnect() {

    }

    async get(path = null) {
		
	}

	async set(path, value) {
		
	}

	async delete(path) {
		
	}

	async getData() {
		
	}

	async setData(data) {
		
	}

	async empty() {
		
	}

	async merge(data) {
		
	}

	async integrate(data) {
		
	}

}

// Export
export { DatastoreClient };
