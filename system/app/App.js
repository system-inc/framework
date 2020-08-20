// Globals
import 'framework/globals/Globals.js';

// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// TODO - this isn't universal
//import Directory from 'framework/system/file-system/Directory.js';

import Module from 'framework/system/module/Module.js';
import Settings from 'framework/system/settings/Settings.js';

// TODO - this isn't universal
//import Terminal from 'framework/system/interface/Terminal.js';

import Version from 'framework/system/version/Version.js';

/* Notes:

Apps can run in a variety of contexts
* Terminal, Electron
* Web browser

We need to know where the code lives for the project and also for framework. In the terminal and Electron, this path will be a Directory, e.g., ~/projects/code/. For the web, this will actually be a URL, such as https://www.project.com/. We need a universal way to address paths, perhaps the URI? E.g., file://blah/?

How do we abstract the app away from the context?

Let's walk through the life cycle of a web app

1. The user loads any web page on a domain, such as project.com/abc
2. The server identifies what content is intended to be rendered, if it is static is just sends down the static content. But if it is not static, it will send down the html and css needed to render the current view but also all of the code necessary to navigate through the app and rely on data over the wire.

UI components are downloaded and cached or fetched on demand.

*/

// Class
// TODO: Rewrite all of this as if a web app with no operating system or file access
class App extends EventEmitter {

	// TODO: Move these all to settings
	title = 'App Title';
	headline = null;
	description = null;
	
	identifier = null;
	version = null;

	// TODO: Move this, doesn't make sense for a web app
	directory = null;

	// TODO: Move this, doesn't make sense for a web app, move under commmand line interface
	standardStreams = {
		input: null,
		output: null,
		error: null,
	};

	// TODO: Move this into standardStreams object standardStreams.fileLog
	standardStreamsFileLog = null;

	// Datastore
	datastore = null;
	sessionDatastore = null;

	// TODO: Turn this into an object
	environment = null;

	modules = {};

	interfaces = {
		//commandLine: null, // Will initialize if necessary
		//interactiveCommandLine: null, // Will initialize if necessary
		//textual: null, // Will initialize if necessary
		//graphical: null, // Will initialize if necessary
	};

	// TODO: Move this, doesn't make sense for a web app
	framework = {
		version: new Version('0.1.0'),
		//directory: new Directory(Node.Path.join(__dirname, '../', '../')),
	};

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
			graphical: {
				// The default settings for graphical interfaces
				defaults: {
					// To show or not show the interface when it is created
					show: true,

					// To open or not open developer tools
					openDeveloperTools: false,
					
					// GraphicalInterfaceManager events that trigger the default settings to be applied
					applyOn: [
						'display.added',
						'display.removed',
						'display.changed',
					],

					// Default settings for any number of displays, overridden by a type or by a numbered display key, e.g., "oneDisplay", "twoDisplays", "threeDisplays", etc.
					display: 1, // The display the graphical interface will appear on
					mode: 'normal', // minimized, normal, maximized, full screen
					width: .5,
					height: .5,
					x: 'center',
					y: 'center',
				},

				// Allow the user to specify custom types of graphical interfaces
				types: {
					// typeName: settings object
				},

				// Should user changes to the settings be saved? If so, they will be used instead of the default settings
				// If there are multiple displays, the user's settings will be saved for that display count
				// Example #1:
				// Say the defaults for one monitor say to show the window in the top right of the first window and there are two monitors
				// and the user drags it to the second monitor, we will save that the user wants it on the second display
				//
				// Example #2:
				// If there are two monitors and by default we put it on the second monitor in the bottom left corner and the user drags
				// it to the first monitor we remember that for the next time they open the app
				saveUserChanges: true,
			},
		},
		modules: {
			archive: {}, // Archive is a default module which is enabled for all apps
		},
	});

	constructor(appDirectory) {
		super();

		// Set the app directory
		//this.directory = new Directory(appDirectory);

		// Set the default file log directory
		this.settings.mergeDefaults({
			standardStreamsFileLog: {
				//directory: Node.Path.join(this.directory, 'logs'),
			},
			interfaces: {
				interactiveCommandLine: {
					history: {
						//directory: Node.Path.join(this.directory, 'logs'),
					},
				},
			},
		});
	}

	async initialize(callback) {
		// Announce starting
		//this.log('Initializing Framework '+this.framework.version+'...');

		if(!this.inWebContext()) {
			// Load the app settings
			await this.loadAppSettings();

			// Use app settings to set the title and the identifier
			this.setPropertiesFromAppSettings();

			// Use app settings to configure the environment
			this.configureEnvironment();

			// Initialize the app process
			await this.intializeProcess();

			// Configure the standard streams
			await this.configureStandardStreams();

			// Configure the standard streams file log
			await this.configureStandardStreamsFileLog();

			// Configure the command line interface
			await this.configureCommandLineInterface();

			// Configure the interactive command line interface
			await this.configureInteractiveCommandLineInterface();

			// Load all of the modules for the App indicated in the app settings
			await this.requireAndInitializeAppModules();
		}

		// Configure the graphical interface
		await this.configureGraphicalInterface();

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
			this.identifier = this.title.toCamelcase();
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

	async intializeProcess() {
		console.log('intializeProcess - Uncomment when ready');

		if(this.inMainContext()) {
			//await this.initializeMainContext();
		}
		else {
			//await this.initializeChildContext();
		}
	}

	async initializeMainContext() {
		console.log('In main context!');

		var Datastore = (await import('framework/system/datastore/Datastore.js')).default;
		var DatastoreServer = (await import('framework/system/datastore/server/DatastoreServer.js')).default;

		// Setup app.datastore server
		this.datastore = new DatastoreServer(new Datastore());
		await this.datastore.initialize();

		// Setup app.sessionDatastore server
		this.sessionDatastore = new DatastoreServer(new Datastore());
		await this.sessionDatastore.initialize();
	}

	async initializeChildContext() {
		console.log('In child context!');

		var DatastoreClient = (await import('framework/system/datastore/server/DatastoreClient.js')).default;

		// Setup app.datastore client
		this.datastore = new DatastoreClient();
		await this.datastore.initialize();

		// Setup app.sessionDatastore client
		this.sessionDatastore = new DatastoreClient();
		await this.sessionDatastore.initialize();
	}

	async configureStandardStreams() {
		var StandardInputStream = (await import('framework/system/stream/StandardInputStream.js')).default;
		var StandardOutputStream = (await import('framework/system/stream/StandardOutputStream.js')).default;
		var StandardErrorStream = (await import('framework/system/stream/StandardErrorStream.js')).default;

		app.standardStreams.input = new StandardInputStream();
		app.standardStreams.output = new StandardOutputStream();
		app.standardStreams.error = new StandardErrorStream();
	}

	async configureStandardStreamsFileLog() {
		var standardStreamsFileLogSettings = this.settings.get('standardStreamsFileLog');
		//this.log('standardStreamsFileLogSettings', standardStreamsFileLogSettings);

		if(standardStreamsFileLogSettings.enabled) {
			//var FileLog = (await import('framework/system/log/FileLog.js')).default;

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
		// TODO: Make this work with standard web pages, load an empty command

		var commandLineInterfaceSettings = this.settings.get('interfaces.commandLine');
		//this.info('commandLineInterfaceSettings', commandLineInterfaceSettings);

		var CommandLineInterface = (await import('framework/system/interface/command-line/CommandLineInterface.js')).default;
		this.interfaces.commandLine = new CommandLineInterface(commandLineInterfaceSettings);
	}

	async configureInteractiveCommandLineInterface() {
		var interactiveCommandLineInterfaceSettings = this.settings.get('interfaces.interactiveCommandLine');
		//this.info('interactiveCommandLineInterfaceSettings', interactiveCommandLineInterfaceSettings);

		// Enable the interactive command line interface by default if in terminal context
		if(interactiveCommandLineInterfaceSettings.enabled && this.inTerminalContext()) {
			var InteractiveCommandLineInterface = (await import('framework/system/interface/interactive-command-line/InteractiveCommandLineInterface.js')).default;

			//console.log('creating InteractiveCommandLineInterface');
			this.interfaces.interactiveCommandLine = new InteractiveCommandLineInterface(interactiveCommandLineInterfaceSettings);
		}
	}

	// Graphical interfaces are treated as a decentralized system. This works well in web browsers, where each browser window is it's own instance of the app.
	async configureGraphicalInterface() {
		//app.log('App configureGraphicalInterface');

		if(this.inGraphicalInterfaceContext()) {
			//app.log('inGraphicalInterfaceContext', true);

			// Create the graphical interface

			var GraphicalInterface = (await import('framework/system/interface/graphical/GraphicalInterface.js')).default;
			this.interfaces.graphical = new GraphicalInterface();
			await this.interfaces.graphical.initialize();
		}
		else {
			//app.log('inGraphicalInterfaceContext', false);
		}
	}

	getUserDirectory() {
		return Node.Process.env[this.onWindows() ? 'USERPROFILE' : 'HOME'];
	}

	getUserDesktopDirectory() {
		return Node.Path.join(this.getUserDirectory(), 'Desktop');
	}

	onWindows() {
		var onWindows = false;

		if(!this.inWebContext()) {
			onWindows = Node.Process.platform == 'win32';
		}
		
		return onWindows;
	}

	onMacOs() {
		var onMacOs = false;

		if(!this.inWebContext()) {
			onMacOs = Node.Process.platform == 'darwin';
		}
		
		return onMacOs;
	}

	onLinux() {
		var onLinux = false;

		if(!this.inWebContext()) {
			onLinux = Node.Process.platform == 'linux';
		}
		
		return onLinux;
	}

	developerToolsAvailable() {
		//return (process && process.versions && process.versions.electron);
		return this.inGraphicalInterfaceContext();
	}

	get log() {
		if(this.developerToolsAvailable()) {
			return console.log.bind(window.console);
		}
		else {
			return function() {
				var formattedLogData = this.formatLogData(...arguments);
				return this.standardStreams.output.writeLine(formattedLogData);
			}
		}
	}

	get info() {
		if(this.developerToolsAvailable()) {
			return console.info.bind(window.console);
		}
		else {
			return function() {
				var formattedLogData = this.formatLogData(...arguments);
				formattedLogData = Terminal.style(formattedLogData, 'cyan');
				return this.standardStreams.output.writeLine(formattedLogData);
			}
		}
	}

	get warn() {
		if(this.developerToolsAvailable()) {
			return console.warn.bind(window.console);
		}
		else {
			return function() {
				var formattedLogData = this.formatLogData(...arguments);
				formattedLogData = Terminal.style(formattedLogData, 'yellow');
				return this.standardStreams.output.writeLine(formattedLogData);
			}
		}
	}

	get error() {
		if(this.developerToolsAvailable()) {
			return console.error.bind(window.console);
		}
		else {
			return function() {
				var formattedLogData = this.formatLogData(...arguments);
				formattedLogData = Terminal.style(formattedLogData, 'red');
				return this.standardStreams.output.writeLine(formattedLogData);
			}
		}
	}

	get table() {
		if(this.developerToolsAvailable()) {
			return console.table.bind(window.console);
		}
		else {
			return function() {
				var formattedLogData = this.formatLogData(...arguments);
				formattedLogData = Terminal.style(formattedLogData, 'green');
				return this.standardStreams.output.writeLine(formattedLogData);
			}
		}
	}

	get highlight() {
		if(this.developerToolsAvailable()) {
			var highlight = "%c \n\n                                                |>>>\r\n                                                |\r\n                                            _  _|_  _\r\n                                           |;|_|;|_|;|\r\n                                           \\\\.    .  \/\r\n                                            \\\\:  .  \/\r\n                                             ||:   |\r\n                                             ||:.  |\r\n                                             ||:  .|\r\n                                             ||:   |       \\,\/\r\n                                             ||: , |            \/`\\\r\n                                             ||:   |\r\n                                             ||: . |\r\n              __                            _||_   |\r\n     ____--`~    \'--~~__            __ ----~    ~`---,              ___\r\n-~--~                   ~---__ ,--~\'                  ~~----_____-~\'   `~----~~\n\n\n\n";
			console.log(highlight, 'color: green;');
			return console.info.bind(window.console);
		}
		else {
			return function() {
				var formattedLogData = this.formatLogData(...arguments);
				formattedLogData = Terminal.style(formattedLogData, 'green');
				return this.standardStreams.output.writeLine(formattedLogData);
			}
		}
	}

	formatLogData() {
		return this.formatLogDataWithMetaDataPrefix(...arguments);
	}

	formatLogDataWithMetaDataPrefix() {
		var formattedLogData = this.formatLogDataWithoutMetaDataPrefix(...arguments);

		// Create a new error
		//var error = new Error('Error manually created to get stack trace.');

	    // Get the location data of the first call site
	    //var callSiteData = error.stack.getCallSite(3);

    	//formattedLogData = '['+new Time().dateTime+'] ('+callSiteData.fileName+':'+callSiteData.lineNumber+') '+formattedLogData;

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
		this.settings.get('modules').each(function(moduleTitle, moduleSettings) {
			moduleTitle = moduleTitle.uppercaseFirstCharacter()+'Module';

			//this.log('Loading "'+moduleTitle+'" module...');
			Module.require(moduleTitle);

			// Store the module title for initialization later
			modulesForApp.append(moduleTitle);
		}.bind(this));

		//this.log('modulesForApp', modulesForApp);

		// Initialize the modules for the App
		await Module.initialize(modulesForApp);
	}

	inMainContext() {
		console.error('Implement inMainContext');
		var inMainContext = true;

		return inMainContext;
	}

	inChildContext() {
		console.error('Implement inChildContext');
		var inChildContext = false;

		return inChildContext;
	}

	inTerminalContext() {
		var inTerminalContext = false;

		// If you are not in a graphical interface you are in a terminal
		//if((Node.Process.stdout.isTTY || Node.Process.stdout.writable) && !this.inGraphicalInterfaceContext()) {
		if(!this.inGraphicalInterfaceContext()) {
			inTerminalContext = true;
		}

		return inTerminalContext;
	}

	inGraphicalInterfaceContext() {
		var inGraphicalInterfaceContext = false;

		if(this.inWebContext()) {
			inGraphicalInterfaceContext = true;
		}

		return inGraphicalInterfaceContext;
	}

	inWebContext() {
		var inWebContext = false;

		if(typeof window !== 'undefined') {
			inWebContext = true;
		}

		return inWebContext;
	}

	inElectronContext() {
		var inElectronContext = false;

		if(process.versions.electron !== undefined) {
			inElectronContext = true;
		}

		return inElectronContext;
	}

	exit = async function() {
		await this.emit('app.beforeExit');

		Node.exit(...arguments);
	}

}

// Export
export default App;
