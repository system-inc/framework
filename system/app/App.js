// Dependencies
import AsciiArt from './../../system/ascii-art/AsciiArt.js';
import Command from './../../system/command/Command.js';
import Module from './../../system/module/Module.js';
import Settings from './../../system/settings/Settings.js';
import Version from './../../system/version/Version.js';

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
		directory: Node.Path.join(__dirname, '../', '../'),
		coreModules: [
			'ConsoleModule',
			'ArchiveModule',
		],
	};

	constructor(appDirectory) {
		// Set the app directory
		this.directory = Node.Path.normalize(appDirectory);
	}

	async initialize(callback) {
		// Make it obvious we are starting
		console.log(AsciiArt.framework.version[this.framework.version.toString()]);

		// Require the core modules
		Module.require(this.framework.coreModules);

		// Announce starting
		//console.log('Initializing Framework '+this.framework.version+'...');

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

		//console.log('Framework initialization complete.');
		console.log('Initialized "'+this.title+'" in '+this.environment+' environment.');
		//console.log('Modules: '+Module.modules.initialized.join(', '));

		// Run the callback (which may be a generator)
		if(callback) {
			callback.bind(this).run();
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
