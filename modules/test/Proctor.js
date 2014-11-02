Proctor = Class.extend({

	passes: 0,
	failures: 0,

	path: Project.framework.directory,

	construct: function() {
		// Configure the console
		//Console.showTime = false;
		Console.showFile = false;

		// Handle passed arguments
		var requestedPath = (Node.Process.argv[2] ? Node.Process.argv[2] : null);
		var requestedTest = (Node.Process.argv[3] ? Node.Process.argv[3] : null);

		this.run();
	},

	run: function*() {
		// If the requested a path that does not start with /, then assume we are testing Framework
		if(requestedPath && !requestedPath.startsWith('/')) {
			path += '/'+requestedPath;
		}
		// If path starts with /, then we are probably testing a Project
		else if(requestedPath) {
			path = requestedPath;
		}

		Console.out(this.path);

		Directory.is()

		// Check if the path is a folder

		// Find all of the tests in the path

		// Find the test they want to run
		require(this.path+'/tests/types/ArrayTest');



		Console.out('Running tests...');

		// Start the stopwatch
		var stopwatch = new Stopwatch();

		var test = new ArrayTest();

		try {
			test.testEquality();
			this.passes++;
		}
		catch(error) {
			this.failures++;
		}

		// Stop the stopwatch
		stopwatch.stop();

		// Notify the user of how many tests passed and failed
		Console.out(this.passes+' passed, '+this.failures+' failed ('+Number.round(stopwatch.elapsedTime)+' '+stopwatch.time.precision+')');

		// Exit the process
		Node.Process.exit();
	},

});