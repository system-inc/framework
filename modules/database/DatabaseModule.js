// Dependencies
var Module = Framework.require('modules/module/Module.js');
var Version = Framework.require('modules/version/Version.js');
var DatabaseManager = Framework.require('modules/database/DatabaseManager.js');

// Class
var DatabaseModule = Module.extend({

	version: new Version('0.1.0'),

	databaseManager: null,

	initialize: function*(settings) {
		//Node.exit('DatabaseModule initialize', settings);
		yield this.super.apply(this, arguments);

		this.databaseManager = new DatabaseManager();

		// Add any databases to the database manager
		var databases = this.settings.get('databases');
		//Console.highlight(databases);
		if(databases) {
			databases.each(function(databaseIdentifier, databaseOptions) {
				this.databaseManager.add(databaseIdentifier, databaseOptions);
			}.bind(this));
		}
	},
	
});

// Export
module.exports = DatabaseModule;