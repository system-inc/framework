// Dependencies


// Class
class AppServiceClient  {

    adapter = null;

	async initialize() {
        // Create and initialize the underlying adapter
        this.adapter = await AppServiceClient.getAdapter();
        await this.adapter.initialize();
    }

	static async getAdapter() {
		var adapter = null;

		// If in a web context use an adapter based on LocalStorage
		// If in Electron context don't use LocalStorage because the app will not have consistent access to the same persisted storage based on the context it is executed in (Electron/terminal)
		if(app.inWebContext() && !app.inElectronContext()) {
			const AppServiceClientWebAdapter = (await import('framework/system/app/service/client/adapters/AppServiceClientWebAdapter.js')).default;
			adapter = new AppServiceClientWebAdapter();
		}
		// If not in a web context use an adapter based on saving files on the disk
		else {
			const AppServiceClientNativeAdapter = (await import('framework/system/app/service/client/adapters/AppServiceClientNativeAdapter.js')).default;
			adapter = new AppServiceClientNativeAdapter();
		}

		return adapter;
	}

}

// Export
export default AppServiceClient;
