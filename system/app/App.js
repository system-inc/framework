// Dependencies
import EventEmitter from 'system/events/EventEmitter.js';
import StandardInputStream from 'system/stream/StandardInputStream.js';
import StandardOutputStream from 'system/stream/StandardOutputStream.js';
import StandardErrorStream from 'system/stream/StandardErrorStream.js';
import FileLog from 'system/log/FileLog.js';
import CommandLineInterface from 'system/interface/command-line/CommandLineInterface.js';
import InteractiveCommandLineInterface from 'system/interface/interactive-command-line/InteractiveCommandLineInterface.js';
import Module from 'system/module/Module.js';
import Settings from 'system/settings/Settings.js';
import Terminal from 'system/interface/Terminal.js';
import Version from 'system/version/Version.js';

// Class
class App extends EventEmitter {

	title = 'App Title';
	headline = null;
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
		interfaces: {
			commandLine: {
				command: {
					description: null,
					options: {
						version: {
							type: 'boolean',
							defaultValue: false,
							description: 'Show the version of the app.',
							aliases: [
								'v',
							],
						},
						help: {
							type: 'boolean',
							defaultValue: false,
							description: 'Show help.',
							aliases: [
								'h',
								'?',
							],
						},
						debugCommand: {
							type: 'boolean',
							defaultValue: false,
							description: 'Show the command configuration.',
							aliases: [
								'dc',
							],
						},
					},
					subcommands: {},
				},
			},
			interactiveCommandLine: {
				enabled: true,
				history: {
					enabled: true,
					directory: null, // Will set this default in constructor
					nameWithoutExtension: 'history',
				},
			},
		},
		modules: {
			archive: {}, // Archive is a default module which is enabled for all apps
		},
	});

	environment = null;

	modules = {};

	interfaces = {
		commandLine: null,
		//interactiveCommandLine: null, // Will initialize if necessary
		//textual: null, // Will initialize if necessary
		//graphical: null, // Will initialize if necessary
	};

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
			interfaces: {
				interactiveCommandLine: {
					history: {
						directory: Node.Path.join(this.directory, 'logs'),
					},
				},
			},
		});
	}

	async initialize(callback) {
		// Announce starting
		//this.log('Initializing Framework '+this.framework.version+'...');

		// Load the app settings
		await this.loadAppSettings();

		// Use app settings to set the title and the identifier
		this.setPropertiesFromAppSettings();

		// Use app settings to configure the environment
		this.configureEnvironment();

		// After the app settings are loaded, we will know how to configure the standard streams file log
		await this.configureStandardStreamsFileLog();

		// Configure the command line interface
		await this.configureCommandLineInterface();

		// Configure the interactive command line interface
		await this.configureInteractiveCommandLineInterface();

		// Load all of the modules for the App indicated in the app settings
		await this.requireAndInitializeAppModules();

		//this.log('Framework initialization complete.');
		//this.log('Initialized "'+this.title+'" in '+this.environment+' environment.');
		//this.log('Modules: '+Module.modules.initialized.join(', '));

		// Run the callback (which may be a generator)
		if(callback) {
			await callback();
		}
	}

	async loadAppSettings() {
		//this.log('Loading app settings...');
		await this.settings.integrateFromFile(Node.Path.join(this.directory, 'settings', 'settings.json'));
		//this.log('loadAppSettings settings.json path ', Node.Path.join(this.directory, 'settings', 'settings.json'));

		// Merge the environment settings
		//this.log('Integrating environment settings...')
		await this.settings.integrateFromFile(Node.Path.join(this.directory, 'settings', 'environment.json'));
		//this.log('app.settings', this.settings);
	}

	async configureStandardStreamsFileLog() {
		var standardStreamsFileLogSettings = this.settings.get('standardStreamsFileLog');
		//this.log('standardStreamsFileLogSettings', standardStreamsFileLogSettings);

		if(standardStreamsFileLogSettings.enabled) {
			// Create the file log
			this.standardStreamsFileLog = new FileLog(standardStreamsFileLogSettings.directory, standardStreamsFileLogSettings.nameWithoutExtension);

			// Hook up standard output to the file log
			this.standardStreams.output.on('stream.data', function(event) {
				this.standardStreamsFileLog.log(event.data);
			}.bind(this));

			// Hook up standard error to the file log
			this.standardStreams.error.on('stream.data', function(event) {
				this.standardStreamsFileLog.error(event.data);
			}.bind(this));

			//this.log('Logging standard stream data to', this.standardStreamsFileLog.file.path+'.');
		}
	}

	async configureCommandLineInterface() {
		var commandLineInterfaceSettings = this.settings.get('interfaces.commandLine');
		//this.info('commandLineInterfaceSettings', commandLineInterfaceSettings);

		this.interfaces.commandLine = new CommandLineInterface(commandLineInterfaceSettings);
	}

	async configureInteractiveCommandLineInterface() {
		var interactiveCommandLineInterfaceSettings = this.settings.get('interfaces.interactiveCommandLine');
		//this.info('interactiveCommandLineInterfaceSettings', interactiveCommandLineInterfaceSettings);

		// Enable the interactive command line interface by default if in terminal context
		if(this.inTerminalContext() && interactiveCommandLineInterfaceSettings.enabled) {
			this.interfaces.interactiveCommandLine = new InteractiveCommandLineInterface(interactiveCommandLineInterfaceSettings);
		}
	}

	setPropertiesFromAppSettings() {
		// Set the title
		var titleFromSettings = this.settings.get('title');
		if(titleFromSettings) {
			this.title = titleFromSettings;
		}

		// Anounce app title
		//this.log('Settings for app "'+this.title+'" loaded.');

		// Set the identifier
		var identifierFromSettings = this.settings.get('identifier');
		if(identifierFromSettings) {
			this.identifier = identifierFromSettings;
		}
		else {
			this.identifier = this.title.toCamelCase();
		}

		// Set the headline
		var headlineFromSettings = this.settings.get('headline');
		if(headlineFromSettings) {
			this.headline = headlineFromSettings;
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

	developerToolsAvailable() {
		return (process && process.versions && process.versions.electron);
	}

	log() {
		if(this.developerToolsAvailable()) {
			console.log(...arguments);
		}

		var formattedLogData = this.formatLogData(...arguments);
		return this.standardStreams.output.writeLine(formattedLogData);
	}

	info() {
		if(this.developerToolsAvailable()) {
			console.info(...arguments);
		}

		var formattedLogData = this.formatLogData(...arguments);
		formattedLogData = Terminal.style(formattedLogData, 'cyan');
		return this.standardStreams.output.writeLine(formattedLogData);
	}

	warn() {
		if(this.developerToolsAvailable()) {
			console.warn(...arguments);
		}

		var formattedLogData = this.formatLogData(...arguments);
		formattedLogData = Terminal.style(formattedLogData, 'yellow');
		return this.standardStreams.output.writeLine(formattedLogData);
	}

	error() {
		if(this.developerToolsAvailable()) {
			console.error(...arguments);
		}

		var formattedLogData = this.formatLogData(...arguments);
		formattedLogData = Terminal.style(formattedLogData, 'red');
		return this.standardStreams.output.writeLine(formattedLogData);
	}

	highlight() {
		if(this.developerToolsAvailable()) {
			var highlight = "%c\n\n                                                |>>>\r\n                                                |\r\n                                            _  _|_  _\r\n                                           |;|_|;|_|;|\r\n                                           \\\\.    .  \/\r\n                                            \\\\:  .  \/\r\n                                             ||:   |\r\n                                             ||:.  |\r\n                                             ||:  .|\r\n                                             ||:   |       \\,\/\r\n                                             ||: , |            \/`\\\r\n                                             ||:   |\r\n                                             ||: . |\r\n              __                            _||_   |\r\n     ____--`~    \'--~~__            __ ----~    ~`---,              ___\r\n-~--~                   ~---__ ,--~\'                  ~~----_____-~\'   `~----~~\n\n\n\n";
			console.log(highlight, 'color: #CCC');
			console.log(...arguments);
		}

		var formattedLogData = this.formatLogData(...arguments);
		formattedLogData = Terminal.style(formattedLogData, 'green');
		return this.standardStreams.output.writeLine(formattedLogData);
	}

	formatLogData() {
		return this.formatLogDataWithMetaDataPrefix(...arguments);
	}

	formatLogDataWithMetaDataPrefix() {
		var formattedLogData = this.formatLogDataWithoutMetaDataPrefix(...arguments);

		// Create a new error
		var error = new Error('Error manually created to get stack trace.');

	    // Get the location data of the first call site
	    var callSiteData = error.stack.getCallSite(3);

    	formattedLogData = '['+new Time().dateTime+'] ('+callSiteData.fileName+':'+callSiteData.lineNumber+') '+formattedLogData;

		return formattedLogData;
	}

	formatLogDataWithoutMetaDataPrefix() {
		var formattedLogData = '';

		arguments.each(function(argumentKey, argument) {
			var formattedLogDataForArgument = argument;

			if(formattedLogDataForArgument === undefined) {
				formattedLogDataForArgument = 'undefined';
			}
			else if(formattedLogDataForArgument === 0) {
				formattedLogDataForArgument = '0';
			}
			else if(formattedLogDataForArgument === true) {
				formattedLogDataForArgument = 'true';
			}
			else if(formattedLogDataForArgument === false) {
				formattedLogDataForArgument = 'false';
			}
			else if(formattedLogDataForArgument === null) {
				formattedLogDataForArgument = 'null';
			}
			// Functions
			else if(Function.is(formattedLogDataForArgument)) {
				formattedLogDataForArgument = Node.Utility.inspect(argument, {
					'showHidden': true,
					'depth': 2,
					'colors': true,
				});
			}
			// Errors
			else if(Error.is(formattedLogDataForArgument)) {
				formattedLogDataForArgument = Terminal.style(formattedLogDataForArgument.toString(), 'red');
			}
			// Non-strings
			else if(!String.is(formattedLogDataForArgument)) {
				formattedLogDataForArgument = Json.indent(formattedLogDataForArgument);

				// If Json encoding fails (e..g, when a logging a class)
				if(formattedLogDataForArgument === undefined) {
					// Show the original argument
					formattedLogDataForArgument	= argument;
				}
			}

			formattedLogData += formattedLogDataForArgument+' ';
		});

		// Remove the last trailing space
		formattedLogData = formattedLogData.replaceLast(' ', '');

		return formattedLogData;
	}

	async requireAndInitializeAppModules() {
		//this.log(this.settings);
		//this.log('Loading modules for app...', this.settings.get('modules'));

		// Load and initialize app modules separately in case multiple app modules rely on each other
		var modulesForApp = [];

		var settings = this.settings.get('modules');
		//this.log('settings', this.settings);

		// Load the modules
		this.settings.get('modules').each(function(moduleName, moduleSettings) {
			moduleName = moduleName.uppercaseFirstCharacter()+'Module';

			//this.log('Loading "'+moduleName+'" module...');
			Module.require(moduleName);

			// Store the module name for initialization later
			modulesForApp.append(moduleName);
		}.bind(this));

		//this.log('modulesForApp', modulesForApp);

		// Initialize the modules for the App
		await Module.initialize(modulesForApp);
	}

	inTerminalContext() {
		var inTerminalContext = false;

		if(Node.Process.stdout.isTTY) {
			inTerminalContext = true;
		}

		return inTerminalContext;
	}

	inElectronContext() {
		var inElectronContext = false;

		if(Node.Process.versions && Node.Process.versions.electron) {
			inElectronContext = true;
		}

		return inElectronContext;
	}

}

// Export
export default App;
