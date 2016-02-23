// Globals
Framework = require('./../Framework.js');

// Class
Project = new (Framework.extend({

	proctor: null,

	run: function*() {
		//Node.exit(this.command);

		// Create a Proctor to oversee all of the tests as they run
		this.proctor = new Proctor(this.command.options.reporter);

		// If test supervising is enabled
		if(this.command.options.supervise) {
			this.proctor.supervise();
		}
		// Get and run the tests
		else {
			this.proctor.getAndRunTests(this.command.options.path, this.command.options.filePattern, this.command.options.methodPattern);
		}
	},

}))(__dirname);

// Initialize and run the test project
Generator.run(function*() {
	yield Project.initialize();
	yield Project.run();
});