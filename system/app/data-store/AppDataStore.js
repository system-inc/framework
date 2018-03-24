// Dependencies
import DataStoreInterface from 'framework/system/data/DataStoreInterface.js';

// Class
/*
	This is a data store which when initialized will automatically use the proper adapter to provide permanent storage for application data.
*/
class AppDataStore extends DataStoreInterface {

	adapter = null;

	constructor() {
		super();

		this.adapter = AppDataStore.getAdapter(...arguments);
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

	static getAdapter() {
		var adapter = null;

		// If in a web context use an adapter based on LocalStorage, because in a web browser we don't have access to write data to the disk
		// If in Electron context don't use LocalStorage because the app will not have consistent access to the same persisted storage based on the context it is executed in (Electron/terminal)
		if(app.inWebContext() && !app.inElectronContext()) {
			//console.log('Using LocalStorage for AppDataStore!');

			var AppDataStoreWebAdapter = require('framework/system/app/data-store/adapters/AppDataStoreWebAdapter.js').default;
			adapter = new AppDataStoreWebAdapter();
		}
		// If not in a web context use an adapter based on SQLite
		else {
			//console.log('Using SQLite for AppDataStore!');

			var AppDataStoreSqliteAdapter = require('framework/system/app/data-store/adapters/AppDataStoreSqliteAdapter.js').default;
			adapter = new AppDataStoreSqliteAdapter();
		}

		return adapter;
	}

}

// Export
export default AppDataStore;
