require('./Log');

LogModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.parent(settings);

		// Log settings 
		// Like access log settings, error log settings, etc.
		//this.settings.set('paths', {Project.path+'logs/');
		//Log.log(this.settings);
	},
	
});