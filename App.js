// Dependencies
require('./globals/Globals.js');

// Class
var App = Class.extend({

	title: 'Project',
	identifier: null,
	description: null,

	version: null,
	settings: null,
	environment: null,
	command: null,

	// Directories
	directory: null,
	framework: {
		directory: __dirname,
	},

	modules: {},

	construct: function(projectDirectory) {
		// Set the project directory
		this.directory = Node.Path.normalize(projectDirectory);
	},

	initialize: function*(callback) {
		// Set the version
		Console.error('fix this');
		var Version = App.require('system/version/Version.js');
		App.version = new Version('0.1.0');

		// Make it obvious we are starting
		var AsciiArt = App.require('system/ascii-art/AsciiArt.js');
		Console.writeLine(AsciiArt.framework.version[App.version.toString()]);

		// Require the core modules
		var Module = App.require('system/module/Module.js');
		Module.require(App.coreModules);

		// Announce starting
		//Console.log('Initializing Framework '+this.version+'...');

		// Use core modules to load the project settings
		yield this.loadProjectSettings();

		// Use project settings to set the title and the identifier
		this.setPropertiesFromProjectSettings();

		// Load the command
		var Command = App.require('system/command/Command.js');
		this.command = new Command(Node.Process.argv, this.settings.get('command'));

		// Use project settings to configure the environment
		this.configureEnvironment();

		// After the environment is initialized, initialize the Framework core modules
		yield Module.initialize(App.coreModules);

		// Load all of the modules for the Project indicated in the project settings
		yield this.requireAndInitializeProjectModules();

		//Console.log('Framework initialization complete.');
		Console.log('Initialized "'+this.title+'" in '+this.environment+' environment.');
		//Console.log('Modules: '+Module.modules.initialized.join(', '));

		// Run the callback (which may be a generator)
		if(callback) {
			callback.bind(this).run();
		}
	},

	loadProjectSettings: function*() {
		//Console.log('Loading project settings...');

		var Settings = App.require('system/settings/Settings.js');
		this.settings = Settings.constructFromFile({
			environment: 'development',
			modules: {},
		}, Node.Path.join(this.directory, 'settings', 'settings.json'));
		//Console.log('loadProjectSettings settings.json path ', Node.Path.join(this.directory, 'settings', 'settings.json'));

		// Merge the environment settings
		//Console.log('Integrating environment settings...')
		this.settings.integrateFromFile(Node.Path.join(this.directory, 'settings', 'environment.json'));
		//Console.log(this.settings);
	},

	setPropertiesFromProjectSettings: function() {
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
		var Version = App.require('system/version/Version.js');
		var versionFromSettings = this.settings.get('version');
		if(versionFromSettings) {
			this.version = new Version(versionFromSettings);
		}
	},

	configureEnvironment: function() {
		this.environment = this.settings.get('environment');

		//Console.log('Configuring environment ('+this.environment+')...');

		// Development
		if(this.environment == 'development') {
		}
	},

	getUserDirectory: function() {
		return Node.Process.env[this.onWindows() ? 'USERPROFILE' : 'HOME'];
	},

	getUserDesktopDirectory: function() {
		return Node.Path.join(this.getUserDirectory(), 'Desktop');
	},

	onWindows: function() {
		return Node.Process.platform == 'win32';
	},

	onMacOs: function() {
		return Node.Process.platform == 'darwin';
	},

	onLinux: function() {
		return Node.Process.platform == 'linux';
	},

	requireAndInitializeProjectModules: function*() {
		//Console.log(this.settings);
		//Console.log('Loading modules for project...', this.settings.get('modules'));

		var Module = App.require('system/module/Module.js');

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
		yield Module.initialize(modulesForProject);
	},

	// Run all require calls through this method
	require: function(identifier) {
		//Console.log('App.require', arguments);

		// Ensure consistency of calls to .require()
		if(!identifier.endsWith('.js')) {
			throw new Error(identifier+' must end with ".js".');
		}

		// If the identifier is absolute
		if(Node.Path.isAbsolute(identifier)) {
			// Do nothing
		}
		// If we are calling the method as an instance of Framework using Project.require, use the Project directory
		else if(Class.isInstance(this, Framework)) {
			identifier = Node.Path.join(Project.directory, identifier);
		}
		// If we are calling the method statically using App.require, use the Framework directory
		else {
			identifier = Node.Path.join(App.directory, identifier);
		}

		//Console.log('App.require()', 'identifier', identifier);

		try {
			return Node.require(identifier);
		}
		catch(exception) {
			Console.error('Error when requiring', identifier);
			throw exception;
		}
	},

});

// Static properties

App.version = null;

App.directory = __dirname;

App.coreModules = [
	'ConsoleModule',
	'ArchiveModule',
];

// Static methods

App.require = App.prototype.require;

// Export
module.exports = Framework;