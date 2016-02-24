// Global - Framework class
Framework = require('./../Framework.js');

// Global - Framework instance
Project = new Framework(__dirname);

// Dependencies
var Proctor = Framework.require('modules/test/Proctor.js');

// Initialize
Project.initialize(function() {
	// Create a Proctor to oversee all of the tests as they run
	var proctor = new Proctor(this.command.options.reporter);

	// If test supervising is enabled
	if(this.command.options.supervise) {
		proctor.supervise();
	}
	// Get and run the tests
	else {
		proctor.getAndRunTests(this.command.options.path, this.command.options.filePattern, this.command.options.methodPattern);
	}
});