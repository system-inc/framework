// Dependencies
import AsciiArt from './../ascii-art/AsciiArt.js';
import Command from './../command/Command.js';
import Module from './../module/Module.js';
import Settings from './../settings/Settings.js';
import Version from './../version/Version.js';

// Class
class App {

	title = 'App Title';
	identifier = null;
	description = null;
	version = null;
	directory = null;
	settings = null;
	environment = null;
	command = null;
	modules = {};
	interfaces = [];

	framework = {
		version: new Version('0.1.0'),
		directory: __dirname,
		coreModules: [
			'ConsoleModule',
			'ArchiveModule',
		],
	};

	constructor(appDirectory) {
		// Set the app directory
		this.directory = Node.Path.normalize(appDirectory);

		this.initialize();
	}

	async initialize(callback) {
		// Make it obvious we are starting
		console.log(AsciiArt.framework.version[this.framework.version.toString()]);

		// Require the core modules
		Module.require(this.framework.coreModules);

		// Announce starting
		Console.log('Initializing Framework '+this.version+'...');

		// Use core modules to load the project settings
		await this.loadAppSettings();

		// Use project settings to set the title and the identifier
		this.setPropertiesFromAppSettings();

		// Load the command
		this.command = new Command(Node.Process.argv, this.settings.get('command'));

		// Use project settings to configure the environment
		this.configureEnvironment();

		// After the environment is initialized, initialize the Framework core modules
		await Module.initialize(this.framework.coreModules);

		// Load all of the modules for the Project indicated in the project settings
		await this.requireAndInitializeProjectModules();

		//Console.log('Framework initialization complete.');
		Console.log('Initialized "'+this.title+'" in '+this.environment+' environment.');
		//Console.log('Modules: '+Module.modules.initialized.join(', '));

		// Run the callback (which may be a generator)
		if(callback) {
			callback.bind(this).run();
		}

		console.log('hi');
	}

	async loadAppSettings() {
		//Console.log('Loading project settings...');
		this.settings = Settings.constructFromFile({
			environment: 'development',
			modules: {},
		}, Node.Path.join(this.directory, 'settings', 'settings.json'));
		//Console.log('loadAppSettings settings.json path ', Node.Path.join(this.directory, 'settings', 'settings.json'));

		// Merge the environment settings
		//Console.log('Integrating environment settings...')
		this.settings.integrateFromFile(Node.Path.join(this.directory, 'settings', 'environment.json'));
		//Console.log(this.settings);
	}

	setPropertiesFromAppSettings() {
		// Set the title
		var titleFromSettings = this.settings.get('title');
		if(titleFromSettings) {
			this.title = titleFromSettings;
		}

		// Anounce project title
		//Console.log('Settings for project "'+this.title+'" loaded.');

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
		var Version = Framework.require('system/version/Version.js');
		var versionFromSettings = this.settings.get('version');
		if(versionFromSettings) {
			this.version = new Version(versionFromSettings);
		}
	}

	configureEnvironment() {
		this.environment = this.settings.get('environment');

		//Console.log('Configuring environment ('+this.environment+')...');

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

	async requireAndInitializeProjectModules() {
		//Console.log(this.settings);
		//Console.log('Loading modules for project...', this.settings.get('modules'));

		// Load and initialize project modules separately in case multiple project modules rely on each other
		var modulesForProject = [];

		// Load the modules
		this.settings.get('modules').each(function(moduleName, moduleSettings) {
			moduleName = moduleName.uppercaseFirstCharacter()+'Module';

			//Console.log('Loading "'+moduleName+'" module...');
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
