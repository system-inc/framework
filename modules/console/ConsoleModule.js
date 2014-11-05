require('./Arguments');
require('./Console');
require('./Terminal');

ConsoleModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);
		this.settings.default({
			'log': {
				'enabled': false,
				'directory': Project.directory+'logs/',
				'nameWithoutExtension': Console.identifier,
			},
		});

		// Attach a log to the console if enabled
		if(this.settings.get('log.enabled')) {
			Console.attachLog(this.settings.get('log.directory'), this.settings.get('log.nameWithoutExtension'));
		}		
	},
	
});