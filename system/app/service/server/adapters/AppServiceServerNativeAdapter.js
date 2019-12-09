// Dependencies
import AppServiceServerAdapterInterface from 'framework/system/app/service/server/adapters/AppServiceServerAdapterInterface.js';
import DomainSocketServer from 'framework/system/server/socket/DomainSocketServer.js';

// Class
class AppServiceServerNativeAdapter extends AppServiceServerAdapterInterface {

    domainSocketServer = null;

	async initialize() {
        await super.initialize();

        var domainSocketFilePath = Node.Path.join(Node.OperatingSystem.tmpdir(), app.identifier+'-app-service.socket');
        //this.domainSocketServer = new DomainSocketServer(domainSocketFilePath);
        //await this.domainSocketServer.initialize();

        return this;
    }

}

// Export
export default AppServiceServerNativeAdapter;
