// Class
class DatabaseConnection {

	name = null;
	socket = null;
	port = null;
	version = null;
	compiledFor = null;
	configurationFile = null;
	serverUptime = null;

	currentDatabase = null;
	databases = [];

	getDatabases() {
		// query SHOW DATABASES
	}

}

// Export
export default DatabaseConnection;
