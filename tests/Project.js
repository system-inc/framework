require('./../Framework.js');

Project = new (Framework.extend({

	proctor: null,

	initialize: function() {
		this.super.apply(this, arguments);

		Console.out(this.arguments); Node.Process.exit();

		// Create a Proctor to oversee all of the tests as they run
		this.proctor = new Proctor(this.arguments.options.reporter);

		// If test supervising is enabled
		if(this.arguments.options['supervise']) {
			this.proctor.supervise();
		}
		// Get and run the tests
		else {
			this.proctor.getAndRunTests(this.arguments.arguments.path, this.arguments.arguments.testMethodName);
		}
	},

}))(__dirname);

Project.initialize();