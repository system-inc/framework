// Dependencies
import DataStore from 'framework/system/data/DataStore.js';

// Class
/*
	This is an abstract data store which when initialized will automatically use the proper adapter to provide permanent storage
	for application data
*/
class AppDataStore extends DataStore {

	rootPath = null;

	constructor(rootPath) {
		this.adapter = AppDataStore.getAdapter(...arguments);
	}

	get(path) {
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

	createNewInstanceWithRootPath(rootPath) {
		return new AppDataStore(rootPath);
	}

	static getAdapter(rootPath) {
		var adapter = null;

		if(app.inWebContext()) {
			var AppDataStoreWebAdapter = require()
			adapter = new AppDataStoreWebAdapter(...arguments);

			var AppDataStoreWebAdapter = require('framework/system/app/data-store/adapters/web/AppDataStoreWebAdapter.js').default;
			this.interfaces.commandLine = new CommandLineInterface(commandLineInterfaceSettings);
		}
		else {
			throw new Error('need to implement');
		}

		return adapter;
	}

}

// Export
export default AppDataStore;
