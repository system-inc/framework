// Dependencies
import AppServiceServer from 'framework/system/app/service/server/AppServiceServer.js';
import AppServiceClient from 'framework/system/app/service/client/AppServiceClient.js';

// Class
/*
    Provides a single source of truth for multiprocess Framework applications
    Powered by a socket server for native apps (Terminal/Electron)
    Powered by localstorage for web apps
*/
class AppService  {
    
    server = null;
    client = null;

    datastore = null;
    sessionDatastore = null;

	async initialize() {
        // Only initialize the server in the main process
        if(app.inMainContext()) {
            await this.initializeServer();

            this.datastore = this.server.datastore;
            this.sessionDatastore = this.server.sessionDatastore;
        }
        else {
            // Initialize the client
            await this.initializeClient();
        }
    }

    async initializeServer() {
        console.log('In the main process, initializing AppServiceServer...');

        this.server = new AppServiceServer();
        await this.server.initialize();
    }

    async initializeClient() {
        this.client = new AppServiceClient();
        await this.client.initialize();
    }

}

// Export
export default AppService;
