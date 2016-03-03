// Class
var DatabaseConnection = Class.extend({

	name: null,
	socket: null,
	port: null,
	version: null,
	compiledFor: null,
	configurationFile: null,
	serverUptime: null,

	currentDatabase: null,
	databases: [],

	getDatabases: function() {
		// query SHOW DATABASES
	},

});

// Export
module.exports = DatabaseConnection;