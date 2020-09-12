// Dependencies
import { Client } from '@framework/system/server/Client.js';

// Class
class DatastoreClient extends Client {

	protocolClient = null;

	// Return the connection from the protocol client
	get connection() {
		return this.protocolClient.connection;
	}

	// Set the connection on the protocol client
	set connection(connection) {
		if(connection !== null && this.protocolClient !== null) {
			this.protocolClient.connection = connection;
		}
	}

	constructor(protocolClient = null) {
		super(); // Client

		// Need to provide a protocol client
		if(protocolClient === null) {
			throw new Error('Must provide a protocol client.');
		}
		else {
			this.protocolClient = protocolClient;
		}
	}

	// Protocol client methods

	async initialize() {
		await this.protocolClient.initialize();
	}

    async connect() {
        return await this.protocolClient.connect.apply(this.protocolClient, arguments);
	}

	// Datastore methods

	async datastoreRequest(method, passedArguments = null) {
		// Make sure passed arguments is an array
		if(passedArguments === null) {
			passedArguments = [];
		}
		else {
			passedArguments = Array.from(passedArguments);
		}

		// Send the request and get a response
		let protocolServerResponseMessage = await this.protocolClient.request({
			method: method,
			arguments: passedArguments,
		});
		// console.log('protocolServerResponseMessage', protocolServerResponseMessage);

		let result = null;

		// If the request succeeded
		if(protocolServerResponseMessage.data && protocolServerResponseMessage.data.statusCode == 200) {
			result = protocolServerResponseMessage.data.data;
		}
		// If the request failed
		else {
			throw new Error(protocolServerResponseMessage.data.statusMessage);
		}

		return result;
	}

	async get(path = null) {
		return await this.datastoreRequest('get', arguments);
	}

	async set(path, value) {
		return await this.datastoreRequest('set', arguments);
	}

	async delete(path) {
		return await this.datastoreRequest('delete', arguments);
	}

	async getData() {
		return await this.datastoreRequest('getData', arguments);
	}

	async setData(data) {
		return await this.datastoreRequest('setData', arguments);
	}

	async empty() {
		return await this.datastoreRequest('empty', arguments);
	}

	async inherit(data) {
		return await this.datastoreRequest('inherit', arguments);
	}

	async merge(data) {
		return await this.datastoreRequest('merge', arguments);
	}

	async integrate(data) {
		return await this.datastoreRequest('integrate', arguments);
	}

}

// Export
export { DatastoreClient };
