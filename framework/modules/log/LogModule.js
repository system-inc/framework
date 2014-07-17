require('./Log');

LogModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.parent(settings);

		// Log settings 
		// Need default settings that can be overwritten by user specified settings
		// Like access log settings, error log settings, etc.
		this.settings.set('file.path', Project.path+'logs/log.log');
		Log.log(this.settings);
	},
	
});