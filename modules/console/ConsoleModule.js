require('./Arguments');
require('./Console');
require('./Terminal');

ConsoleModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);
		this.settings.default({
			'commandHistory': {
				'enabled': true,
				'directory': Project.directory+'logs'+Node.Path.separator,
				'nameWithoutExtension': Console.identifier+'-command-history',
			},
			'log': {
				'enabled': false,
				'directory': Project.directory+'logs'+Node.Path.separator,
				'nameWithoutExtension': Console.identifier,
			},
		});

		// Attach a log to the console if enabled
		if(this.settings.get('log.enabled')) {
			Console.attachLog(this.settings.get('log.directory'), this.settings.get('log.nameWithoutExtension'));
		}

		// Load command history if enabled
		if(this.settings.get('commandHistory.enabled')) {
			Console.loadCommandHistory(this.settings.get('commandHistory.directory'), this.settings.get('commandHistory.nameWithoutExtension'));
		}
	},
	
});