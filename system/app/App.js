// Dependencies
import EventEmitter from './../../system/events/EventEmitter.js';
import StandardInputStream from './../../system/stream/StandardInputStream.js';
import StandardOutputStream from './../../system/stream/StandardOutputStream.js';
import StandardErrorStream from './../../system/stream/StandardErrorStream.js';
import FileLog from './../../system/log/FileLog.js';
import AsciiArt from './../../system/ascii-art/AsciiArt.js';
import Command from './../../system/command/Command.js';
import Module from './../../system/module/Module.js';
import Settings from './../../system/settings/Settings.js';
import Version from './../../system/version/Version.js';

// Class
class App extends EventEmitter {

	title = 'App Title';
	description = null;
	
	identifier = null;
	version = null;

	directory = null;

	standardStreams = {
		input: new StandardInputStream(),
		output: new StandardOutputStream(),
		error: new StandardErrorStream(),
	};
	standardStreamsFileLog = null;

	settings = new Settings({
		environment: 'development',
		standardStreamsFileLog: {
			enabled: true,
			directory: null, // Will set this default in constructor
			nameWithoutExtension: 'app',
		},
		modules: {},
	});

	environment = null;

	command = null;

	modules = {};

	interfaces = {};

	framework = {
		version: new Version('0.1.0'),
		directory: Node.Path.join(__dirname, '../', '../'),
	};

	constructor(appDirectory) {
		super();

		// Set the app directory
		this.directory = Node.Path.normalize(appDirectory);

		// Set the default file log directory
		this.settings.mergeDefaults({
			standardStreamsFileLog: {
				directory: Node.Path.join(this.directory, 'logs'),
			},
		});
	}

	async initialize(callback) {
		// Make it obvious we are starting
		this.log(AsciiArt.framework.version[this.framework.version.toString()]);

		// Announce starting
		//this.log('Initializing Framework '+this.framework.version+'...');

		// Load the project settings
		await this.loadAppSettings();

		// After the project settings are loaded, we will know how to configure the standard streams file log
		await this.configureStandardStreamsFileLog();

		// Use project settings to set the title and the identifier
		this.setPropertiesFromAppSettings();

		// Load the command
		this.command = new Command(Node.Process.argv, this.settings.get('command'));

		// Use project settings to configure the environment
		this.configureEnvironment();

		// Load all of the modules for the Project indicated in the project settings
		await this.requireAndInitializeProjectModules();

		//this.log('Framework initialization complete.');
		this.log('Initialized "'+this.title+'" in '+this.environment+' environment.');
		//this.log('Modules: '+Module.modules.initialized.join(', '));

		// Run the callback (which may be a generator)
		if(callback) {
			await callback();
		}
	}

	async loadAppSettings() {
		//this.log('Loading project settings...');
		await this.settings.integrateFromFile(Node.Path.join(this.directory, 'settings', 'settings.json'));
		//this.log('loadAppSettings settings.json path ', Node.Path.join(this.directory, 'settings', 'settings.json'));

		// Merge the environment settings
		//this.log('Integrating environment settings...')
		await this.settings.integrateFromFile(Node.Path.join(this.directory, 'settings', 'environment.json'));
		//this.log(this.settings);
	}

	async configureStandardStreamsFileLog() {
		var standardStreamsFileLogSettings = this.settings.get('standardStreamsFileLog');
		//this.log('standardStreamsFileLogSettings', standardStreamsFileLogSettings);

		if(standardStreamsFileLogSettings.enabled) {
			// Create the file log
			this.standardStreamsFileLog = new FileLog(standardStreamsFileLogSettings.directory, standardStreamsFileLogSettings.nameWithoutExtension);

			// Hook up standard input to the file log
			this.standardStreams.input.on('stream.write', function(data) {
				this.standardStreamsFileLog.emit('log.log', data);
			}.bind(this));

			// Hook up standard output to the file log
			this.standardStreams.output.on('stream.write', function(data) {
				this.standardStreamsFileLog.emit('log.log', data);
			}.bind(this));

			// Hook up standard error to the file log
			this.standardStreams.error.on('stream.write', function(data) {
				this.standardStreamsFileLog.emit('log.error', data);
			}.bind(this));
		}
	}

	setPropertiesFromAppSettings() {
		// Set the title
		var titleFromSettings = this.settings.get('title');
		if(titleFromSettings) {
			this.title = titleFromSettings;
		}

		// Anounce project title
		//this.log('Settings for project "'+this.title+'" loaded.');

		// Set the identifier
		var identifierFromSettings = this.settings.get('identifier');
		if(identifierFromSettings) {
			this.identifier = identifierFromSettings;
		}
		else {
			this.identifier = this.title.toCamelCase();
		}

		// Set the description
		var descriptionFromSettings = this.settings.get('description');
		if(descriptionFromSettings) {
			this.description = descriptionFromSettings;
		}

		// Set the version
		var versionFromSettings = this.settings.get('version');
		if(versionFromSettings) {
			this.version = new Version(versionFromSettings);
		}
	}

	configureEnvironment() {
		this.environment = this.settings.get('environment');

		//this.log('Configuring environment ('+this.environment+')...');

		// Development
		if(this.environment == 'development') {
		}
	}

	getUserDirectory() {
		return Node.Process.env[this.onWindows() ? 'USERPROFILE' : 'HOME'];
	}

	getUserDesktopDirectory() {
		return Node.Path.join(this.getUserDirectory(), 'Desktop');
	}

	onWindows() {
		return Node.Process.platform == 'win32';
	}

	onMacOs() {
		return Node.Process.platform == 'darwin';
	}

	onLinux() {
		return Node.Process.platform == 'linux';
	}

	log() {
		return this.standardStreams.output.writeLine(this.formatLogData(...arguments));
	}

	info() {
		return this.standardStreams.output.writeLine(this.formatLogData(...arguments));
	}

	warn() {
		return this.standardStreams.output.writeLine(this.formatLogData(...arguments));
	}

	error() {
		return this.standardStreams.error.writeLine(this.formatLogData(...arguments));
	}

	formatLogData() {
		var formattedLogData = '';

		arguments.each(function(argumentKey, argument) {
			var formattedLogDataForArgument = argument;

			if(!String.is(formattedLogDataForArgument)) {
				formattedLogDataForArgument = Json.encode(formattedLogDataForArgument);
			}

			formattedLogData += formattedLogDataForArgument+' ';
		});

		// Remove the last trailing space
		formattedLogData = formattedLogData.replaceLast(' ', '');

		return formattedLogData;
	}

	async requireAndInitializeProjectModules() {
		//this.log(this.settings);
		//this.log('Loading modules for project...', this.settings.get('modules'));

		// Load and initialize project modules separately in case multiple project modules rely on each other
		var modulesForProject = [];

		// Load the modules
		this.settings.get('modules').each(function(moduleName, moduleSettings) {
			moduleName = moduleName.uppercaseFirstCharacter()+'Module';

			//this.log('Loading "'+moduleName+'" module...');
			Module.require(moduleName);

			// Store the module name for initialization later
			modulesForProject.append(moduleName);
		}.bind(this));

		// Initialize the modules for the Project
		await Module.initialize(modulesForProject);
	}

}

// Export
export default App;
