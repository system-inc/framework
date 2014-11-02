Proctor = Class.extend({

	testMethods: [],
	testClasses: {},

	passes: 0,
	failures: 0,

	/*
	get the tests the user wants to run
		this is going to be an array of
			test method name
			test class name
			test file name
			test directory name

		tell the test reporter how many tests we are going to run
	
	run the tests
		tell the test reporter which test we are now running
		when the test finishes, send results (fail, pass, elapsed time) to the test reporter

	tell the reporter we finished and how long it took

	*/
	
	construct: function() {
		// Configure the console
		Console.showTime = false;
		Console.showFile = false;

		// Clear the screen
		Console.write('\033[2J');
		Console.write('\033[H');
	},

	resolvePath: function(path) {
		// If the path does not exist, we are in the default Framework tests directory
		if(!path) {
			path = Project.framework.directory+'tests/';
		}
		// If the path does not start with a slash, we are in the default Framework tests directory
		else if(!path.startsWith('/')) {
			path = Project.framework.directory+'tests/'+path;
		}

		// If the path does not end with .js, we are looking for a directory of tests which will always terminate with a slash
		if(!path.endsWith('.js')) {
			if(!path.endsWith('/')) {
				path = path+'/';
			}
		}

		return path;
	},

	getTestMethod: function(methodName, className, classFileName, directory) {
		return {
			methodName: methodName,
			className: className,
			classFileName: classFileName,
			directory: directory,
		};
	},

	getAndRunTestMethods: function*(path, testMethodName) {
		yield this.getTestMethods(path, testMethodName);
		yield this.runTestMethods();
	},

	getTestMethods: function*(path, testMethodName) {
		// Resolve the path
		path = this.resolvePath(path);
		
		// If we are working with a directory of tests
		if(path.endsWith('/')) {

		}
		// If we are working with a single test file
		else {
			// Instantiate a file object for the test class file
			var testClassFile = new File(path);
			
			// If the test class file exists
			var fileExists = yield File.exists(testClassFile.file);
			if(fileExists) {
				// Require the test class file
				require(testClassFile.file);

				// Instantiate the test class
				var testClass = this.testClasses[testClassFile.nameWithoutExtension];
				// Cache the test class if we don't have it already instantiated
				if(!testClass) {
					testClass = new global[testClassFile.nameWithoutExtension]();
					this.testClasses[testClassFile.nameWithoutExtension] = testClass;
				}
				
				// If they want to run all tests in the class
				if(!testMethodName) {
					// Loop through all of the class properties
					for(var key in testClass) {
						// All tests must start with "test" and be a function
						if(key.startsWith('test') && Function.is(testClass[key])) {
							this.testMethods.push(this.getTestMethod(key, testClassFile.nameWithoutExtension, testClassFile.name, testClassFile.directory));		
						}
					}
				}
				else {
					var expandedTestMethodName = 'test'+testMethodName.uppercaseFirstCharacter();

					// If they want to run a specific method in the class
					if(testMethodName && testClass[testMethodName]) {
						this.testMethods.push(this.getTestMethod(testMethodName, testClassFile.nameWithoutExtension, testClassFile.name, testClassFile.directory));
					}
					// If they want to run a specific method in the class using a shorthand testMethodName
					else if(testMethodName && testClass[expandedTestMethodName]) {
						this.testMethods.push(this.getTestMethod(expandedTestMethodName, testClassFile.nameWithoutExtension, testClassFile.name, testClassFile.directory));
					}
					// If the passed testMethod name does not exist on the test class
					else {
						this.exit('The test class "'+testClassFile.nameWithoutExtension+'" does not have the method "'+testMethodName+'", aborting.');
					}
				}
			}
			// If the test class file does not exists
			else {
				this.exit('The file '+testClassFile.file+' does not exist, aborting.');
			}
		}

		return this.testMethods;
	},

	getElapsedTimeString: function(elapsedTime, precision) {
		return '\x1B[90m('+Number.addCommas(Number.round(elapsedTime, 3))+' '+precision+')\x1B[39m';
	},

	runTestMethods: function*() {
		Console.out('Running '+this.testMethods.length+' tests...'+"\n");

		// Start the stopwatch
		var stopwatch = new Stopwatch();

		// Keep track of the last test class
		var lastTestClassName;

		for(var i = 0; i < this.testMethods.length; i++) {
			// Set the current test method
			var currentTestMethod = this.testMethods[i];

			// Get the current test class
			var currentTestClassName = currentTestMethod.className;

			// Print out the current class
			if(currentTestClassName != lastTestClassName) {
				Console.out('  '+currentTestClassName.replaceLast('Test', '')+"\n");
				lastTestClassName = currentTestClassName;
			}

			// Get the instantiated test class
			var testClass = this.testClasses[currentTestMethod.className];

			// Time the test
			var testMethodStopwatch = new Stopwatch();

			// Run the test
			try {
				yield testClass[currentTestMethod.methodName]();
				testMethodStopwatch.stop();

				Console.out('    \x1B[32m✓\x1B[39m '+currentTestMethod.methodName.replaceFirst('test', '').lowercaseFirstCharacter()+' '+this.getElapsedTimeString(testMethodStopwatch.elapsedTime, testMethodStopwatch.time.precision));
				this.passes++;
			}
			// If the test fails
			catch(error) {
				Console.out(error);
				this.failures++;
			}
		}

		// Stop the stopwatch
		stopwatch.stop();

		// Exit the process
		this.exit("\n"+this.passes+' passed, '+this.failures+' failed '+this.getElapsedTimeString(stopwatch.elapsedTime, stopwatch.time.precision));
	},

	exit: function(message) {
		Console.out(message+"\n");
		Node.Process.exit();
	},

});