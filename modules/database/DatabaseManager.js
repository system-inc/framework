DatabaseManagerClass = Class.extend({

	databases: {},

	add: function(databaseIdentifier, databaseSettings) {
		var database = new Database(databaseSettings);

		this.databases[databaseIdentifier] = database;

		// Make a global reference to the database for convenience
		global[databaseIdentifier.capitalize()+'Database'] = database;
	},

	get: function(databaseIdentifier) {
		return this.databases.getKeyForValue(databaseIdentifier);
	},

});

DatabaseManager = new DatabaseManagerClass();