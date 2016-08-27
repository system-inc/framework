// Dependencies
import EventEmitter from './../../system/events/EventEmitter.js';
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

	settings = null;
	environment = null;

	standardStreams = {
		input: new StandardInputStream(),
		output: new StandardOutputStream(),
		error: new StandardErrorStream(),
	};

	command = null;

	modules = {};

	/*
		Ways to interface with an app

		should i make one app capable of doing all of these things?

		commandLineInterface
		command line -> run the app with arguments, one input, one output
			i/o comes over standard in/out

		interactiveCommandLineInterface
		interactive command line? -> while the app is running issue command interactively
			i/o comes over standard in/out
			Persistent command history
			Built-in help
			Built-in tabbed auto-completion
			Command-specific auto-completion
			Customizable prompts
		
		textualInterface
		textual interface -> similar to graphical except rendered by text and ansi escape codes
			i/o comes over standard in/out
			can handle mouse position, etc.
			similar to nano/vim/top/htop

		graphicalInterface
		graphical -> pixel by pixel options, powered by electron for now


		so where does the log log to?

		Log -> emits log, info, warn, and error events with data, by default does nothing

			FileLog -> captures log events and writes them to a file
			ConsoleLog -> captures log events and writes them to the console/standardOut

		---

		all framework apps have a interactive command line interface
		app.standardStreams.output.write();
		app.standardStreams.output.writeLine();

		app.log calls
			app.standardStreams.output.writeLine()
			if standard out is not available it will call
			console.log()
			it will also emit
			app.emit('log.log', data);


		StandardStreamsLog
			listens to standardStreams.input/output/error

		app configures app.fileLog
			this.standardStreams.input.on('data', function() {
				this.emit('log.log', data);
			}.bind(this));
			this.standardStreams.error.on('data', function() {
				this.emit('log.log', data);
			}.bind(this));
			this.standardStreams.output.on('data', function() {
				this.emit('log.log', data);
			}.bind(this));
			app.fileLog

		listens to standard streams and writes to logs
	*/
	interfaces = {};

	fileLog = null;
	consoleLog = null;

	framework = {
		version: new Version('0.1.0'),
		directory: Node.Path.join(__dirname, '../', '../'),
	};

	constructor(appDirectory) {
		// Set the app directory
		this.directory = Node.Path.normalize(appDirectory);
	}

	async initialize(callback) {
		// Make it obvious we are starting
		console.log(AsciiArt.framework.version[this.framework.version.toString()]);

		// Announce starting
		//console.log('Initializing Framework '+this.framework.version+'...');

		// Load the project settings
		await this.loadAppSettings();

		// Use project settings to set the title and the identifier
		this.setPropertiesFromAppSettings();

		// Load the command
		this.command = new Command(Node.Process.argv, this.settings.get('command'));

		// Use project settings to configure the environment
		this.configureEnvironment();

		// Load all of the modules for the Project indicated in the project settings
		await this.requireAndInitializeProjectModules();

		//console.log('Framework initialization complete.');
		console.log('Initialized "'+this.title+'" in '+this.environment+' environment.');
		//console.log('Modules: '+Module.modules.initialized.join(', '));

		// Run the callback (which may be a generator)
		if(callback) {
			await callback();
		}
	}

	async loadAppSettings() {
		//console.log('Loading project settings...');
		this.settings = await Settings.constructFromFile({
			environment: 'development',
			modules: {},
		}, Node.Path.join(this.directory, 'settings', 'settings.json'));
		//console.log('loadAppSettings settings.json path ', Node.Path.join(this.directory, 'settings', 'settings.json'));

		// Merge the environment settings
		//console.log('Integrating environment settings...')
		await this.settings.integrateFromFile(Node.Path.join(this.directory, 'settings', 'environment.json'));
		//console.log(this.settings);
	}

	setPropertiesFromAppSettings() {
		// Set the title
		var titleFromSettings = this.settings.get('title');
		if(titleFromSettings) {
			this.title = titleFromSettings;
		}

		// Anounce project title
		//console.log('Settings for project "'+this.title+'" loaded.');

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

		//console.log('Configuring environment ('+this.environment+')...');

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
		return console.log(...arguments);
	}

	info() {
		return console.info(...arguments);
	}

	warn() {
		return console.warn(...arguments);
	}

	error() {
		return console.error(...arguments);
	}

	async requireAndInitializeProjectModules() {
		//console.log(this.settings);
		//console.log('Loading modules for project...', this.settings.get('modules'));

		// Load and initialize project modules separately in case multiple project modules rely on each other
		var modulesForProject = [];

		// Load the modules
		this.settings.get('modules').each(function(moduleName, moduleSettings) {
			moduleName = moduleName.uppercaseFirstCharacter()+'Module';

			//console.log('Loading "'+moduleName+'" module...');
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
