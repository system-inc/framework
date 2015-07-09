require('./../Framework.js');

Project = new (Framework.extend({

	proctor: null,

	initialize: function() {
		this.super.apply(this, arguments);

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

Project.initialize();