// Dependencies
var Module = Framework.require('modules/module/Module.js');
var Version = Framework.require('modules/version/Version.js');
var Proctor = Framework.require('modules/test/Proctor.js');

// Class
var TestModule = Module.extend({

	version: new Version('0.1.0'),
	proctor: null,

	initialize: function*() {
		yield this.super.apply(this, arguments);

		// Create a Proctor to oversee all of the tests as they run
		this.proctor = new Proctor(Project.command.options.reporter);
		
		//return; // Debug

		// If test supervising is enabled
		if(Project.command.options.supervise) {
			this.proctor.supervise();
		}
		// Get and run the tests
		else {
			this.proctor.getAndRunTests(Project.command.options.path, Project.command.options.filePattern, Project.command.options.methodPattern);
		}
	},
	
});

// Export
module.exports = TestModule;