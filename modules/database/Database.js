Database = Class.extend({

	name: null,
	
	defaultCharacterSet: null,
	defaultCollation: null,

	tables: [],
	tableCount: null,

	sizeInBytes: null,

	settings: null,

	databaseConnectionPool: null,

	construct: function(settings) {
		this.settings = Settings.default({
			host: 'localhost',
			port: '3306',
			ipAddress: null,
			socketPath: null,
			username: null,
			password: null,
			databaseName: null,
			connectionLimit: 10,
			timeZone: 'local',
			connectTimeout: 10000,
		}, settings);

		this.name = this.settings.get('databaseName');

		// Connect
		this.connect();
	},

	connect: function() {
		this.databaseConnectionPool = Node.MySql.createPool({
			host: this.settings.get('host'), // host: The hostname of the database you are connecting to. (Default: localhost)
			port: this.settings.get('port'), // port: The port number to connect to. (Default: 3306)
			localAddress: this.settings.get('ipAddress'), // localAddress: The source IP address to use for TCP connection. (Optional)
			socketPath: this.settings.get('socketPath'), // socketPath: The path to a unix domain socket to connect to. When used host and port are ignored.
			user: this.settings.get('username'), // user: The MySQL user to authenticate as.
			password: this.settings.get('password'), // password: The password of that MySQL user.
			database: this.settings.get('databaseName'), // database: Name of the database to use for this connection (Optional).
			connectionLimit: this.settings.get('connectionLimit'), // connectionLimit: The maximum number of connections to create at once. (Default: 10)
			timezone: this.settings.get('timeZone'), // timezone: The timezone used to store local dates. (Default: 'local')
			connectTimeout: this.settings.get('connectTimeout'), // connectTimeout: The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 10 seconds)
			trace: false, // trace: Generates stack traces on Error to include call site of library entrance ("long stack traces"). Slight performance penalty for most calls. (Default: true)
			// charset: The charset for the connection. This is called "collation" in the SQL-level of MySQL (like utf8_general_ci). If a SQL-level charset is specified (like utf8mb4) then the default collation for that charset is used. (Default: 'UTF8_GENERAL_CI')
			// stringifyObjects: Stringify objects instead of converting to values. See issue #501. (Default: 'false')
			// insecureAuth: Allow connecting to MySQL instances that ask for the old (insecure) authentication method. (Default: false)
			// typeCast: Determines if column values should be converted to native JavaScript types. (Default: true)
			// queryFormat: A custom query format function. See Custom format.
			// supportBigNumbers: When dealing with big numbers (BIGINT and DECIMAL columns) in the database, you should enable this option (Default: false).
			// bigNumberStrings: Enabling both supportBigNumbers and bigNumberStrings forces big numbers (BIGINT and DECIMAL columns) to be always returned as JavaScript String objects (Default: false). Enabling supportBigNumbers but leaving bigNumberStrings disabled will return big numbers as String objects only when they cannot be accurately represented with JavaScript Number objects (which happens when they exceed the [-2^53, +2^53] range), otherwise they will be returned as Number objects. This option is ignored if supportBigNumbers is disabled.
			dateStrings: true, // Force date types (TIMESTAMP, DATETIME, DATE) to be returned as strings rather then inflated into JavaScript Date objects. (Default: false)
			// debug: Prints protocol details to stdout. (Default: false)
			// multipleStatements: Allow multiple mysql statements per query. Be careful with this, it exposes you to SQL injection attacks. (Default: false)
			// flags: List of connection flags to use other than the default ones. It is also possible to blacklist default ones. For more information, check Connection Flags.
			// ssl: object with ssl parameters or a string containing name of ssl profile. See SSL options.
			// acquireTimeout: The milliseconds before a timeout occurs during the connection acquisition. This is slightly different from connectTimeout, because acquiring a pool connection does not always involve making a connection. (Default: 10 seconds)
			// waitForConnections: Determines the pool's action when no connections are available and the limit has been reached. If true, the pool will queue the connection request and call it when one becomes available. If false, the pool will immediately call back with an error. (Default: true)
			// connectionLimit: The maximum number of connections to create at once. (Default: 10)
			// queueLimit: The maximum number of connection requests the pool will queue before returning an error from getConnection. If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
		});
	},

	query: function*(query, values, options) {
		var queryResults = yield Node.MySql.Adapter.query(this.databaseConnectionPool, query, values);

		// Reform the rows
		// TODO: Make this an option
		var reformedRows = [];
		queryResults.rows.each(function(index, row) {
			var reformedRow = {};

			row.each(function(key, value) {
				reformedRow[key.toCamelCase()] = value;
			});

			reformedRows.push(reformedRow.sort());
		});
		queryResults.rows = reformedRows;

		return queryResults;
	},

	loadTables: function*() {
		var tables = [];

		var fullTables = yield this.query('SHOW TABLE STATUS');
		yield fullTables.rows.each(function*(index, value) {
			var table = new DatabaseTable(value.name, this);
			yield table.loadProperties(value);

			tables.push(table);
		}, this);

		this.tables = tables;

		return this.tables;
	},

	// See SQLyog "New Data Search"
	search: function() {

	},

	drop: function() {

	},

	truncate: function() {

	},

	empty: function() {

	},

	toSql: function() {

	},

	getSchema: function*() {
		var schema = {};

		// Set the name
		schema.name = this.name;

		// Set the variables
		var variables = yield this.query('SHOW VARIABLES WHERE `Variable_name` = ? OR `Variable_name` = ?', ['character_set_database', 'collation_database']);
		schema.defaultCharacterSet = variables.rows.getObjectWithKeyValue('variableName', 'character_set_database').value;
		schema.defaultCollation = variables.rows.getObjectWithKeyValue('variableName', 'collation_database').value;

		// Get the tables
		yield this.loadTables();

		// Set the tables
		schema.tables = [];
		yield this.tables.each(function*(index, table) {
			var tableSchema = yield table.getSchema();
			schema.tables.push(tableSchema);
		}, this);

		return schema;
	},

});