// Dependencies
import { MultiprotocolServer } from '@framework/system/server/MultiprotocolServer.js';
import { Datastore } from '@framework/system/datastore/Datastore.js';

// Class
class DatastoreServer extends MultiprotocolServer {

	datastore = null;

    constructor(datastore = null) {
		super();

		// Create an in memory datastore if one is not provided
		if(datastore === null) {
			datastore = new Datastore();
		}

        this.datastore = datastore;
	}

	async initialize() {
		// Need to add a protocol server using addProtocolServer() before calling initialize()
		if(this.protocolServers.getSize() == 0) {
			throw new Error('Must provide a protocol server using await addProtocolServer() before calling initialize().');
		}

		await super.initialize();

		// Have the protocol servers listen for requests
        this.protocolServers.each(function(protocolServerIdentifier, protocolServer) {
            protocolServer.on('message', async function(event) {
				let message = event.data;
				// app.log('message', message);

				// If the request is valid
				if(message.data && message.data.method && typeof(this.datastore[message.data.method]) !== 'undefined') {
					// console.log('message.data', message.data);
					
					// Query the datastore
					let datastoreResponse =  await this.datastore[message.data.method].apply(this.datastore, message.data.arguments);
					// app.log('datastoreResponse', datastoreResponse);

					// Respond to the request
					message.respond({
						statusCode: 200,
						statusMessage: 'OK',
						data: datastoreResponse,
					});
				}
				// If the request is malformed
				else {
					message.respond({
						statusCode: 400,
						statusMessage: 'Bad Request',
						request: message.data,
					});
				}
			}.bind(this));
        }.bind(this));
	}

	// Datastore methods
	// Allow direct access to the datastore from the DatastoreServer

    async get(path = null) {
		return await this.datastore.get.apply(this.datastore, arguments);
	}

	async set(path, value) {
		return await this.datastore.set.apply(this.datastore, arguments);
	}

	async delete(path) {
		return await this.datastore.delete.apply(this.datastore, arguments);
	}

	async getData() {
		return await this.datastore.getData.apply(this.datastore, arguments);
	}

	async setData(data) {
		return await this.datastore.setData.apply(this.datastore, arguments);
	}

	async empty() {
		return await this.datastore.empty.apply(this.datastore, arguments);
	}

	async inherit(data) {
		return await this.datastore.inherit.apply(this.datastore, arguments);
	}

	async merge(data) {
		return await this.datastore.merge.apply(this.datastore, arguments);
	}

	async integrate(data) {
		return await this.datastore.integrate.apply(this.datastore, arguments);
	}

}

// Export
export { DatastoreServer };
