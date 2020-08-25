// Globals
import '@framework/globals/NodeGlobals.js';
import '@framework/globals/Globals.js';

// Dependencies
import { EventEmitter } from '@framework/system/event/EventEmitter.js';
import { Version } from '@framework/system/version/Version.js';
import { Settings } from '@framework/system/settings/Settings.js';
import { Datastore } from '@framework/system/datastore/Datastore.js';

// Class
class App extends EventEmitter {

	// Proxy these from settings
	get identifier() {
		return this.settings.get('identifier');
	}
	get title() {
		return this.settings.get('title');
	};
	get version() {
		return new Version(this.settings.get('version'));
	};
	get environment() {
		return this.settings.get('environment');
	};
	get path() {
		return this.settings.get('path');
	};
	get script() {
		return this.settings.get('script');
	};

	framework = {
		get version() {
			return new Version(app.settings.get('framework.version'));
		},
		get path() {
			return app.settings.get('framework.path');
		},
	};

	// Datastore
	datastore = null;
	sessionDatastore = null;

	// Modules
	modules = {};

	// Interfaces
	interfaces = {
		//commandLine: null, // Will initialize if necessary
		//interactiveCommandLine: null, // Will initialize if necessary
		//textual: null, // Will initialize if necessary
		//graphical: null, // Will initialize if necessary
	};

	// Settings
	settings = null;

	// State
	state = null;

	constructor(settings) {
		super(); // EventEmitter

		// Create the settings
		this.settings = new Settings({
			title: 'App',
			version: '1.0.0',
			framework: {
				version: '1.0.0',
			},
			headline: null,
			description: null,
			environment: 'development',
			modules: {},
		}, settings);

		// Create the state
		this.state = new Datastore();
	}

	async initialize() {
		// Announce starting
		//this.log('Initializing Framework '+this.framework.version+'...');

		// Initialize settings for the Node environment
		if(this.inNodeEnvironment()) {
			await this.initializeNodeEnvironmentSettings();
		}

		// Use app settings to set the title and the identifier
		await this.setPropertiesFromAppSettings();

		// Use app settings to configure the environment
		await this.configureEnvironment();

		// Initialize for the Node environment
		if(this.inNodeEnvironment()) {
			await this.initializeNodeEnvironment();

			// Load all of the modules for the app indicated in the app settings
			// TODO: Allow this to be run in graphical interface environments
			await this.importAndInitializeModules();
		}

		// Initialize for the web environment
		if(this.inGraphicalInterfaceEnvironment()) {
			await this.initializeGraphicalInterfaceEnvironment();
		}

		//this.log('Framework initialization complete.');
		//this.log('Initialized "'+this.title+'" in '+this.environment+' environment.');
		//this.log('Modules:', app.modules);
	}

	async initializeNodeEnvironmentSettings() {
		// Merge in more default settings
		this.settings.mergeDefaults({
			path: null,
			script: null,
			framework: {
				path: null,
			},
			standardStreamsFileLog: {
				enabled: true,
				directory: null,
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
						directory: null,
						nameWithoutExtension: 'history',
					},
				},
			},
			modules: {
				archive: {}, // Archive is a default module which is enabled for all apps in Node environments
			},
		});

		// Set the App path and script
		var appScriptPath = process.argv[1]; // Argument 0 is the path to node, argument 1 is the path to the script
		var appPath = Node.Path.dirname(appScriptPath);
		this.settings.set('path', appPath);
		this.settings.set('script', appScriptPath);

		// Set the Framework path
		var frameworkPath = Node.Path.dirname(import.meta.url.replace('file://', '')); //  .../framework/system/app
		frameworkPath = Node.Path.resolve(frameworkPath, '../../'); // .../framework
		this.settings.set('framework.path', frameworkPath);

		// Set the logs path
		var logsPath = Node.Path.join(this.path, 'logs');

		// Set the standard streams file log path
		this.settings.set('standardStreamsFileLog.directory', logsPath);

		// Set the interactive command line file path
		this.settings.set('interfaces.interactiveCommandLine.history.directory', logsPath);

		//console.log('this.settings', this.settings);

		// Load the app settings
		await this.loadAppSettings();
	}

	async initializeNodeEnvironment() {
		// Initialize the app process
		await this.initializeProcess();

		// Configure the standard streams
		await this.configureStandardStreams();

		// Configure the standard streams file log
		await this.configureStandardStreamsFileLog();

		// Configure the command line interface
		await this.configureCommandLineInterface();

		// Configure the interactive command line interface
		await this.configureInteractiveCommandLineInterface();
	}

	async loadAppSettings() {
		//this.log('Loading app settings...');
		await this.settings.integrateFromFile(Node.Path.join(this.path, 'settings', 'settings.json'));
		// console.log('loadAppSettings settings.json path', Node.Path.join(this.path, 'settings', 'settings.json'));

		// Merge the environment settings
		//this.log('Integrating environment settings...')
		await this.settings.integrateFromFile(Node.Path.join(this.path, 'settings', 'environment.json'));
		//this.log('app.settings', this.settings);
	}

	async setPropertiesFromAppSettings() {
		// Anounce app title
		//this.log('Settings for app "'+this.title+'" loaded.');

		// Set the identifier
		var identifierFromSettings = this.settings.get('identifier');
		if(!identifierFromSettings) {
			this.settings.set('identifier', this.title.toCamelCase());
		}
	}

	async configureEnvironment() {
		//this.log('Configuring environment ('+this.environment+')...');
	}

	async initializeProcess() {
		//console.log('initializeProcess - Uncomment when ready');

		if(this.inMainProcessEnvironment()) {
			await this.initializeMainProcessEnvironment();
		}
		else {
			await this.initializeChildProcessEnvironment();
		}
	}

	async initializeMainProcessEnvironment() {
		//console.log('In main process!');

		// const { Datastore } = await import('@framework/system/datastore/Datastore.js');
		// const { DatastoreServer } = await import('@framework/system/datastore/server/DatastoreServer.js');

		// // Setup app.datastore server
		// this.datastore = new DatastoreServer(new Datastore());
		// await this.datastore.initialize();

		// // Setup app.sessionDatastore server
		// this.sessionDatastore = new DatastoreServer(new Datastore());
		// await this.sessionDatastore.initialize();
	}

	async initializeChildProcessEnvironment() {
		//console.log('In child process!');

		// const { DatastoreClient } = await import('@framework/system/datastore/server/DatastoreClient.js');

		// // Setup app.datastore client
		// this.datastore = new DatastoreClient();
		// await this.datastore.initialize();

		// // Setup app.sessionDatastore client
		// this.sessionDatastore = new DatastoreClient();
		// await this.sessionDatastore.initialize();
	}

	async configureStandardStreams() {
		const { StandardInputStream } = await import('@framework/system/stream/StandardInputStream.js');
		const { StandardOutputStream } = await import('@framework/system/stream/StandardOutputStream.js');
		const { StandardErrorStream } = await import('@framework/system/stream/StandardErrorStream.js');

		this.standardStreams = {
			input: new StandardInputStream(),
			output: new StandardOutputStream(),
			error: new StandardErrorStream(),
		};
	}

	async configureStandardStreamsFileLog() {
		var standardStreamsFileLogSettings = this.settings.get('standardStreamsFileLog');
		//this.log('standardStreamsFileLogSettings', standardStreamsFileLogSettings);

		if(standardStreamsFileLogSettings.enabled) {
			const { FileLog } = await import('@framework/system/log/FileLog.js');

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

		const { CommandLineInterface } = await import('@framework/system/interface/command-line/CommandLineInterface.js');
		this.interfaces.commandLine = new CommandLineInterface(commandLineInterfaceSettings);
	}

	async configureInteractiveCommandLineInterface() {
		var interactiveCommandLineInterfaceSettings = this.settings.get('interfaces.interactiveCommandLine');
		//this.info('interactiveCommandLineInterfaceSettings', interactiveCommandLineInterfaceSettings);

		// Enable the interactive command line interface by default if in terminal environment
		if(interactiveCommandLineInterfaceSettings.enabled && this.inTerminalEnvironment()) {
			const { InteractiveCommandLineInterface } = await import('@framework/system/interface/interactive-command-line/InteractiveCommandLineInterface.js');

			//console.log('creating InteractiveCommandLineInterface');
			this.interfaces.interactiveCommandLine = new InteractiveCommandLineInterface(interactiveCommandLineInterfaceSettings);
		}
	}

	async importAndInitializeModules() {
		//this.log(this.settings);
		//this.log('Loading modules for app...', this.settings.get('modules'));

		const { Module } = await import('@framework/system/module/Module.js');

		// Load and initialize app modules separately in case multiple app modules rely on each other
		var modulesForApp = [];

		//var settings = this.settings.get('modules');
		//this.log('settings', this.settings);

		// Load the modules
		await this.settings.get('modules').each(async function(moduleTitle, moduleSettings) {
			moduleTitle = moduleTitle.uppercaseFirstCharacter()+'Module';

			//this.log('Loading "'+moduleTitle+'" module...');
			await Module.import(moduleTitle);

			// Store the module title for initialization later
			modulesForApp.append(moduleTitle);
		}.bind(this));

		//this.log('modulesForApp', modulesForApp);

		// Initialize the modules for the App
		await Module.initialize(modulesForApp);
	}

	async initializeGraphicalInterfaceEnvironment() {
		this.settings.mergeDefaults({
			interfaces: {
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
		});

		// Configure the graphical interface when the DOM has loaded
		// TODO: Change how do I do this to make it not web specific
		document.addEventListener('DOMContentLoaded', function(event) {
			this.configureGraphicalInterface();
		}.bind(this));
	}

	// Graphical interfaces are treated as a decentralized system. This works well in web browsers, where each browser window is it's own instance of the app.
	async configureGraphicalInterface() {
		//app.log('App configureGraphicalInterface');

		//app.log('inGraphicalInterfaceEnvironment', true);

		// Create the graphical interface
		const { GraphicalInterface } = await import('@framework/system/interface/graphical/GraphicalInterface.js');
		this.interfaces.graphical = new GraphicalInterface();
		await this.interfaces.graphical.initialize();
	}

	getUserPath() {
		return Node.Process.env[this.onWindows() ? 'USERPROFILE' : 'HOME'];
	}

	getUserDesktopPath() {
		return Node.Path.join(this.getUserPath(), 'Desktop');
	}

	onWindows() {
		var onWindows = false;

		if(!this.inWebEnvironment()) {
			onWindows = Node.Process.platform == 'win32';
		}
		
		return onWindows;
	}

	onMacOs() {
		var onMacOs = false;

		if(!this.inWebEnvironment()) {
			onMacOs = Node.Process.platform == 'darwin';
		}
		
		return onMacOs;
	}

	onLinux() {
		var onLinux = false;

		if(!this.inWebEnvironment()) {
			onLinux = Node.Process.platform == 'linux';
		}
		
		return onLinux;
	}

	developerToolsAvailable() {
		//return (process && process.versions && process.versions.electron);
		return this.inGraphicalInterfaceEnvironment();
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

	inMainProcessEnvironment() {
		//console.error('Implement inMainProcessEnvironment');
		var inMainProcessEnvironment = true;

		return inMainProcessEnvironment;
	}

	inChildProcessEnvironment() {
		console.error('Implement inChildProcessEnvironment');
		var inChildProcessEnvironment = false;

		return inChildProcessEnvironment;
	}

	inTerminalEnvironment() {
		var inTerminalEnvironment = false;

		// If you are not in a graphical interface you are in a terminal
		//if((Node.Process.stdout.isTTY || Node.Process.stdout.writable) && !this.inGraphicalInterfaceEnvironment()) {
		if(!this.inGraphicalInterfaceEnvironment()) {
			inTerminalEnvironment = true;
		}

		return inTerminalEnvironment;
	}

	inGraphicalInterfaceEnvironment() {
		var inGraphicalInterfaceEnvironment = false;

		if(this.inWebEnvironment()) {
			inGraphicalInterfaceEnvironment = true;
		}

		return inGraphicalInterfaceEnvironment;
	}

	inWebEnvironment() {
		var inWebEnvironment = false;

		if(typeof window !== 'undefined') {
			inWebEnvironment = true;
		}

		return inWebEnvironment;
	}

	inNodeEnvironment() {
		var inNodeEnvironment = false;
		
		if(typeof process !== 'undefined' && process.release.name === 'node') {
			inNodeEnvironment = true;
		}

		return inNodeEnvironment;
	}

	inElectronEnvironment() {
		var inElectronEnvironment = false;

		if(process.versions.electron !== undefined) {
			inElectronEnvironment = true;
		}

		return inElectronEnvironment;
	}

	exit = async function() {
		await this.emit('app.beforeExit');

		Node.exit(...arguments);
	}

}

// Export
export { App };
