require('./Log');

LogModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.super(settings);
		this.version = new Version('1.0');

		// Log settings 
		// Need default settings that can be overwritten by user specified settings
		// Like access log settings, error log settings, etc.
		this.settings.set('file.path', Project.directory+'logs/log.log');
		//Log.log(this.settings);
	},
	
});