require('./adapter/NodeMySql');
require('./Database');
require('./DatabaseField');
require('./DatabaseTable');
require('./DatabaseTableColumn');
require('./DatabaseTableIndex');
require('./DatabaseTableRelationship');
require('./DatabaseConnection');
require('./DatabaseManager');

DatabaseModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.super(settings);

		// Add any databases to the database manager
		var databases = this.settings.get('databases');
		//Console.highlight(databases);
		if(databases) {
			databases.each(function(databaseIdentifier, databaseOptions) {
				DatabaseManager.add(databaseIdentifier, databaseOptions);
			});
		}
	},
	
});

// Initialize the module
DatabaseModule = new DatabaseModuleClass();