// Dependencies
import DatastoreInterface from 'framework/system/data/datastore/DatastoreInterface.js';

// Class
/*
	This is a data store which when initialized will automatically use the proper adapter to provide permanent storage for application data.
*/
class AppDatastore extends DatastoreInterface {

	adapter = null;

	async initialize() {
		this.adapter = await AppDatastore.getAdapter();
	}

	get(path = null) {
		return this.adapter.get(...arguments);
	}

	set(path, value) {
		return this.adapter.set(...arguments);
	}

	delete(path) {
		return this.adapter.delete(...arguments);
	}

	getData() {
		return this.adapter.getData(...arguments);
	}

	setData(data) {
		return this.adapter.setData(...arguments);
	}

	empty() {
		return this.adapter.empty(...arguments);
	}

	merge(data) {
		return this.adapter.merge(...arguments);
	}

	integrate(data) {
		return this.adapter.integrate(...arguments);
	}

	static async getAdapter() {
		var adapter = null;

		// If in a web context use an adapter based on LocalStorage, because in a web browser we don't have access to write data to the disk
		// If in Electron context don't use LocalStorage because the app will not have consistent access to the same persisted storage based on the context it is executed in (Electron/terminal)
		if(app.inWebContext() && !app.inElectronContext()) {
			//console.log('Using LocalStorage for AppDatastore!');

			const AppDatastoreWebAdapter = (await import('framework/system/app/datastore/adapters/AppDatastoreWebAdapter.js')).default;
			adapter = new AppDatastoreWebAdapter();
		}
		// If not in a web context use an adapter based on saving files on the disk
		else {
			const AppDatastoreFileAdapter = (await import('framework/system/app/datastore/adapters/AppDatastoreFileAdapter.js')).default;
			adapter = new AppDatastoreFileAdapter();
		}

		return adapter;
	}

}

// Export
export default AppDatastore;
