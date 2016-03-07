// Globals - Node
Node = require('./globals/node/Node.js');
Buffer = require('./globals/node/Buffer.js');
Stream = require('./globals/node/Stream.js');

// Globals - Standard
Array = require('./globals/standard/Array.js');
Boolean = require('./globals/standard/Boolean.js');
Function = require('./globals/standard/Function.js');
Object = require('./globals/standard/Object.js');
Promise = require('./globals/standard/Promise.js');
RegularExpression = require('./globals/standard/RegularExpression.js');

// Globals - Custom
Class = require('./globals/custom/Class.js');
Generator = require('./globals/custom/Generator.js');
Json = require('./globals/custom/Json.js');
Primitive = require('./globals/custom/Primitive.js');
Time = require('./globals/custom/Time.js');

// Globals - Standard - depend on Class
Error = require('./globals/standard/errors/Error.js');
Exception = require('./globals/standard/errors/Exception.js');
//Error = require('./globals/standard/errors/Error.js');
//EvalError = require('./globals/standard/errors/EvalError.js');
//InternalError = require('./globals/standard/errors/InternalError.js');
//RangeError = require('./globals/standard/errors/RangeError.js');
//ReferenceError = require('./globals/standard/errors/ReferenceError.js');
//SyntaxError = require('./globals/standard/errors/SyntaxError.js');
//TypeError = require('./globals/standard/errors/TypeError.js');
//URIError = require('./globals/standard/errors/URIError.js');

// Globals - Standard - depend on Generator
Number = require('./globals/standard/Number.js');
String = require('./globals/standard/String.js');

// Globals
Console = require('./system/console/Console.js');

// Class
var Framework = Class.extend({

	title: null,
	identifier: null,

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
		var Version = Framework.require('system/version/Version.js');
		this.version = new Version('0.1.0');

		// Make it obvious we are starting
		var AsciiArt = Framework.require('system/ascii-art/AsciiArt.js');
		Console.writeLine(AsciiArt.framework.version[this.version.toString()]);

		// Require the core modules
		var Module = Framework.require('system/module/Module.js');
		Module.require(Framework.coreModules);

		// Announce starting
		//Console.log('Initializing Framework '+this.version+'...');

		// Use core modules to load the project settings
		yield this.loadProjectSettings();

		// Load the command
		var Command = Framework.require('system/command/Command.js');
		this.command = new Command(Node.Process.argv, this.settings.get('command'));

		// Use project settings to set the title and the identifier
		this.setTitleAndIdentifier();

		// Use projet settings to configure the environment
		this.configureEnvironment();

		// After the environment is initialized, initialize the Framework core modules
		yield Module.initialize(Framework.coreModules);

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

		var Settings = Framework.require('system/settings/Settings.js');
		this.settings = Settings.constructFromFile(Node.Path.join(this.directory, 'settings', 'settings.json'));

		// Set the default settings
		this.settings.setDefaults({
			environment: 'development',
		});
		//Console.log(this.settings);

		// Merge the environment settings
		//Console.log('Integrating environment settings...')
		this.settings.integrateSettingsFromFile(Node.Path.join(this.directory, 'settings', 'environment.json'));
		//Console.log(this.settings);
	},

	setTitleAndIdentifier: function() {
		// Set the title
		var title = this.settings.get('title');
		if(title) {
			this.title = title;
		}

		// Anounce project title
		//Console.log('Settings for project "'+this.title+'" loaded.');

		// Set the identifier
		var identifier = this.settings.get('identifier');
		if(identifier) {
			this.identifier = identifier;
		}
		else {
			this.identifier = this.title.toCamelCase();
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

	onOsX: function() {
		return Node.Process.platform == 'darwin';
	},

	onLinux: function() {
		return Node.Process.platform == 'linux';
	},

	requireAndInitializeProjectModules: function*() {
		//Console.log('Loading modules for project...');

		var Module = Framework.require('system/module/Module.js');

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
		//Console.log('Framework.require', arguments);

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
		// If we are calling the method statically using Framework.require, use the Framework directory
		else {
			identifier = Node.Path.join(Framework.directory, identifier);
		}

		//Console.log('Framework.require()', 'identifier', identifier);

		try {
			return Node.require(identifier);
		}
		catch(exception) {
			throw exception;
		}
	},

});

// Static properties

Framework.directory = __dirname;

Framework.coreModules = [
	'ConsoleModule',
];

// Static methods

Framework.require = Framework.prototype.require;

// Attach an event emitter
Framework.eventEmitter = new Node.EventEmitter();
Framework.emit = function(eventName, data) {
	Framework.eventEmitter.emit(eventName, data);
}
Framework.on = function(eventName, callback) {
	Framework.eventEmitter.on(eventName, callback);
};

// Export
module.exports = Framework;