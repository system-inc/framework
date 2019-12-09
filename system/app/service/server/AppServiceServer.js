// Dependencies


// Class
class AppServiceServer  {

    adapter = null;

    datastore = null;
    sessionDatastore = null;

	async initialize() {
        // Create and initialize the underlying adapter
        this.adapter = await AppServiceServer.getAdapter();
        await this.adapter.initialize();

        // Create the datastore
        this.datastore = await this.createDatastore();

        // Create the session datastore
        this.sessionDatastore = await this.createDatastore();
    }

    async createDatastore() {
        return await this.adapter.createDatastore();
    }

    async createSessionDatastore() {
        return await this.adapter.createSessionDatastore();
    }

	static async getAdapter() {
		var adapter = null;

		// If in a web context use an adapter based on LocalStorage
		// If in Electron context don't use LocalStorage because the app will not have consistent access to the same persisted storage based on the context it is executed in (Electron/terminal)
		if(app.inWebContext() && !app.inElectronContext()) {
			const AppServiceServerWebAdapter = (await import('framework/system/app/service/server/adapters/AppServiceServerWebAdapter.js')).default;
			adapter = new AppServiceServerWebAdapter();
		}
		// If not in a web context use an adapter based on saving files on the disk
		else {
			const AppServiceServerNativeAdapter = (await import('framework/system/app/service/server/adapters/AppServiceServerNativeAdapter.js')).default;
			adapter = new AppServiceServerNativeAdapter();
		}

		return adapter;
	}

}

// Export
export default AppServiceServer;
