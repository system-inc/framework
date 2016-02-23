// Dependencies
var Module = Framework.require('modules/module/Module.js');
var Version = Framework.require('modules/version/Version.js');
var ConsoleSession = Framework.require('modules/console/ConsoleSession.js');

// Class
var ConsoleModule = Module.extend({

	version: new Version('0.1.0'),

	defaultSettings: {
		'commandHistory': {
			'enabled': true,
			'directory': Node.Path.join(Project.directory, 'logs'),
			'nameWithoutExtension': 'console-command-history',
		},
		'log': {
			'enabled': true,
			'directory': Node.Path.join(Project.directory, 'logs'),
			'nameWithoutExtension': 'console',
		},
	},

	consoleSession: null,

	initialize: function*(settings) {
		yield this.super.apply(this, arguments);

		// Create a ConsoleSession to manage logging and interaction with the console
		Console.session = this.consoleSession = new ConsoleSession();

		// Attach a log to the console if enabled
		if(this.settings.get('log.enabled')) {
			Console.session.attachLog(this.settings.get('log.directory'), this.settings.get('log.nameWithoutExtension'));
		}

		// Load command history if enabled
		if(this.settings.get('commandHistory.enabled')) {
			Console.session.loadCommandHistory(this.settings.get('commandHistory.directory'), this.settings.get('commandHistory.nameWithoutExtension'));
		}
	},
	
});

// Export
module.exports = ConsoleModule;