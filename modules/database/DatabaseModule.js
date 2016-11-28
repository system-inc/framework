// Dependencies
import Module from 'framework/system/module/Module.js';
import Version from 'framework/system/version/Version.js';
import DatabaseManager from 'framework/system/database/DatabaseManager.js';

// Class
class DatabaseModule extends Module {

	version = new Version('0.1.0');

	databaseManager = null;

	async initialize(settings) {
		//app.exit('DatabaseModule initialize', settings);
		await super.initialize(...arguments);

		this.databaseManager = new DatabaseManager();

		// Add any databases to the database manager
		var databases = this.settings.get('databases');
		//app.highlight(databases);
		if(databases) {
			databases.each(function(databaseIdentifier, databaseOptions) {
				this.databaseManager.add(databaseIdentifier, databaseOptions);
			}.bind(this));
		}
	}
	
}

// Export
export default DatabaseModule;
