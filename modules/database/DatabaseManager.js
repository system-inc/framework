// Dependencies
var Database = Framework.require('modules/database/Database.js');

// Class
var DatabaseManager = Class.extend({

	databases: {},

	add: function(databaseIdentifier, databaseSettings) {
		var database = new Database(databaseSettings);

		this.databases[databaseIdentifier] = database;
	},

	get: function(databaseIdentifier) {
		return this.databases.getValueForKey(databaseIdentifier);
	},

});

// Export
module.exports = DatabaseManager;