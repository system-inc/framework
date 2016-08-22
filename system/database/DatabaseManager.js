// Dependencies
import Database from './Database.js';

// Class
class DatabaseManager {

	databases = {};

	add(databaseIdentifier, databaseSettings) {
		var database = new Database(databaseSettings);

		this.databases[databaseIdentifier] = database;
	}

	get(databaseIdentifier) {
		return this.databases.getValueForKey(databaseIdentifier);
	}

}

// Export
export default DatabaseManager;
