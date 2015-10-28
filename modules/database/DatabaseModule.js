DatabaseModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'libraries/mysql/MySql',
		'Database',
		'DatabaseField',
		'DatabaseTable',
		'DatabaseTableColumn',
		'DatabaseTableIndex',
		'DatabaseTableRelationship',
		'DatabaseConnection',
		'DatabaseManager',
	],

	initialize: function*(settings) {
		//Node.exit('DatabaseModule initialize');
		yield this.super.apply(this, arguments);

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