require('./adapter/NodeMySql');
require('./Database');
require('./DatabaseTable');
require('./DatabaseTableColumn');
require('./DatabaseTableIndex');
require('./DatabaseTableRelationship');
require('./DatabaseConnection');
require('./DatabaseManager');

DatabaseModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);

		// Add any databases to the database manager
		var databases = this.settings.get('databases');
		if(databases) {
			databases.each(function(databaseIdentifier, databaseOptions) {
				DatabaseManager.add(databaseIdentifier, databaseOptions);
			});
		}
	},
	
});

// Initialize the module
DatabaseModule = new DatabaseModuleClass();