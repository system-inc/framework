Proctor = Class.extend({

	tests: {},
	testQueue: [],
	testClasses: {},

	previousTest: null,
	currentTest: null,
	currentTestClass: null,
	nextTest: null,

	failedTests: [],
	
	passes: 0,
	failures: 0,

	testReporter: null,

	stopwatch: null,
	currentTestClassStopwatch: null,
	currentTestMethodStopwatch: null,

	currentTestMethodStatus: null,
	
	construct: function(testReporterIdentifier) {
		// Configure the console
		Console.showTime = false;
		Console.showFile = false;

		// Instantiate a test reporter
		if(testReporterIdentifier === undefined) {
			this.testReporter = new StandardTestReporter();
		}
		else if(testReporterIdentifier.lowercase() == 'standard') {
			this.testReporter = new DotTestReporter();
		}
		else if(testReporterIdentifier.lowercase() == 'dot') {
			this.testReporter = new DotTestReporter();
		}
		else if(testReporterIdentifier.lowercase() == 'concise') {
			this.testReporter = new ConciseTestReporter();
		}
		else {
			this.testReporter = new StandardTestReporter();
		}
	},

	supervise: function*() {
		// Use ASCII art
		require(Project.framework.directory+'modules'+Node.Path.separator+'ascii-art'+Node.Path.separator+'AsciiArt.js');

		// Keep track of the last test class and methods changed
		var activeTest = {
			class: null,
			method: null, // Will implement this at some point, right now I can't figure out a good way to do
		};
		
		// Watch the project and framework directories
		var watchedFileSystemObjects = yield FileSystem.watch([Project.directory, Project.framework.directory], function(fileSystemObject, currentStatus, previousStatus) {
			if(fileSystemObject.path.endsWith('Test.js')) {
				// Set the active test class
				activeTest.class = fileSystemObject.path.replace(Project.framework.directory+'tests'+Node.Path.separator, '');
			}

			Console.out("\r\n".repeat(64));

			Console.out(fileSystemObject.path, 'updated.');
			Console.out(Terminal.style(AsciiArt.weapons.swords.samurai.pointingRight, 'blue'));

			// If there is no active test file
			if(!activeTest.class) {
				Console.out(Terminal.style("\r\n"+'Did not run tests, please update (touch) the test class file you would like to run.', 'red'));
				Console.out(Terminal.style(AsciiArt.weapons.swords.samurai.pointingLeft, 'blue'));
			}
			else {
				// Spawn the child process
			    var nodeChildProcess = exports.child = Node.ChildProcess.spawn('node', ['--harmony', 'tests'+Node.Path.separator+'Test.js', activeTest.class], {
			    	stdio: 'inherit',
			    });

				nodeChildProcess.on('close', function(code) {
					Console.out(Terminal.style(AsciiArt.weapons.swords.samurai.pointingLeft, 'blue'));
					Console.out('Tests finished. Child process exited with code '+code+'. Will run tests on next file update...'+String.newline);
				});
			}
		});

		// Tell the user how many objects we are watching
		Console.out("\r\n"+'Watching', watchedFileSystemObjects.length, 'file system objects for updates...'+"\r\n");
	},

	emit: function(eventName, data) {
		Framework.emit(eventName, data);
	},

	resolvePath: function(path) {
		// If the path does not exist, we are in the default Framework tests directory
		if(!path) {
			path = Project.framework.directory+'tests'+Node.Path.separator;
		}
		// If the path does not start with a slash, we are in the default Framework tests directory
		else if(!path.startsWith(Node.Path.separator)) {
			path = Project.framework.directory+'tests'+Node.Path.separator+path;
		}

		// If the path does not end with .js, we are looking for a directory of tests which will always terminate with a slash
		if(!path.endsWith('.js')) {
			if(!path.endsWith(Node.Path.separator)) {
				path = path+Node.Path.separator;
			}
		}

		return path;
	},

	getAndRunTests: function*(path, testMethodName) {
		yield this.getTests(path, testMethodName);
		yield this.runTests();
	},

	getTestCount: function() {
		var count = 0;

		this.tests.each(function(key, value) {
			count++;
		});

		return count;
	},

	getTestMethodCount: function() {
		var count = 0;

		this.tests.each(function(key, value) {
			count = count + value.methods.length;
		});

		return count;
	},

	getTests: function*(path, testMethodName) {
		// Resolve the path
		path = this.resolvePath(path);
		
		// If we are working with a directory of tests
		if(path.endsWith(Node.Path.separator)) {
			// Recursively get all of the file system objects in the path
			var fileSystemObjects = yield FileSystem.list(path, true);

			// Loop through each of the file system objects
			fileSystemObjects.each(function(index, fileSystemObject) {
				// If we have a file
				if(Class.isInstance(fileSystemObject, File)) {
					// We need to see if this is a test class file, if the file is not "Test.js" but ends with "Test.js" it should be
					if(fileSystemObject.name != 'Test.js' && fileSystemObject.name.endsWith('Test.js')) {
						// Require the test class file
						require(fileSystemObject.file);

						var testClassName = fileSystemObject.nameWithoutExtension;

						// Add the test class to tests
						this.addTest(testClassName, fileSystemObject.name, fileSystemObject.directory);

						// Instantiate the test class
						var testClass = this.testClasses[testClassName];
						// Cache the test class if we don't have it already instantiated
						if(!testClass) {
							testClass = new global[testClassName]();
							this.testClasses[testClassName] = testClass;
						}

						// Loop through all of the class properties
						for(var key in testClass) {
							// All tests must start with "test" and be a function
							if(key.startsWith('test') && Function.is(testClass[key])) {
								this.tests[testClassName].methods.push(key);
							}
						}
					}
				}
			}, this);
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

				var testClassName = testClassFile.nameWithoutExtension;

				// Add the test class to tests
				this.addTest(testClassName, testClassFile.name, testClassFile.directory);

				// Instantiate the test class
				var testClass = this.testClasses[testClassName];
				// Cache the test class if we don't have it already instantiated
				if(!testClass) {
					testClass = new global[testClassName]();
					this.testClasses[testClassName] = testClass;
				}
				
				// If they want to run all tests in the class
				if(!testMethodName) {
					// Loop through all of the class properties
					for(var key in testClass) {
						// All tests must start with "test" and be a function
						if(key.startsWith('test') && Function.is(testClass[key])) {
							this.tests[testClassName].methods.push(key);
						}
					}
				}
				else {
					var expandedTestMethodName = 'test'+testMethodName.uppercaseFirstCharacter();

					// If they want to run a specific method in the class
					if(testMethodName && testClass[testMethodName]) {
						this.tests[testClassName].methods.push(testMethodName);
					}
					// If they want to run a specific method in the class using a shorthand testMethodName
					else if(testMethodName && testClass[expandedTestMethodName]) {
						this.tests[testClassName].methods.push(expandedTestMethodName);
					}
					// If the passed testMethod name does not exist on the test class
					else {
						this.exit('The test class "'+testClassName+'" does not have the method "'+testMethodName+'", aborting.');
					}
				}
			}
			// If the test class file does not exists
			else {
				this.exit('The file '+testClassFile.file+' does not exist, aborting.');
			}
		}

		return this;
	},

	addTest: function(name, fileName, directory) {
		if(!this.tests[name]) {
			this.tests[name] = {
				'name': name,
				'fileName': fileName,
				'directory': directory,
				'methods': [],
			};
		}
	},

	getElapsedTimeString: function(elapsedTime, precision, useThresholds, warningThreshold, errorThreshhold) {
		var elapsedTimeString = '('+Number.addCommas(Number.round(elapsedTime, 3))+' '+precision+')';
		var style = 'gray';

		// Color warning thresholds
		if(useThresholds && elapsedTime > warningThreshold) {
			style = 'yellow';
		}

		// Color error thresholds
		if(useThresholds && elapsedTime > errorThreshhold) {
			style = 'red';
		}

		return Terminal.style(elapsedTimeString, style);
	},

	buildTestQueue: function() {
		this.tests.each(function(testClassName, test) {
			test.methods.each(function(testMethodNameIndex, testMethodName) {
				// Build a new structure for tests in the test queue
				var testToAddToQueue = {
					method: testMethodName,
				};

				// Bring in all of the properties of the test
				testToAddToQueue.merge(test.clone());

				// Except for the methods property
				delete testToAddToQueue['methods'];

				// Add the test to the queue
				this.testQueue.push(testToAddToQueue);
			}.bind(this));
		}.bind(this));
	},

	runTests: function*() {
		// Get the totals
		var testCount = this.getTestCount();
		var testMethodCount = this.getTestMethodCount();

		// Build the test queue
		this.buildTestQueue();
		//Console.out(this.testQueue);

		// Started running tests
		this.emit('TestReporter.startedRunningTests', {
			testCount: testCount,
			testMethodCount: testMethodCount,
		});

		// Start the stopwatch
		this.stopwatch = new Stopwatch();

		// Run the next test
		this.runNextTest();
	},

	runNextTest: function*() {
		// Set the first test
		if(!this.currentTest && !this.testQueue.isEmpty()) {
			this.previousTest = null;
			this.currentTest = this.testQueue.first();
			this.nextTest = this.testQueue.get(1);
		}
		// If we aren't on the first test, move on to the next test
		else if(this.currentTest) {
			this.previousTest = this.currentTest;

			// Remove the first test off of the test queue
			this.testQueue.shift();

			this.currentTest = this.testQueue.first();
			this.nextTest = this.testQueue.get(1);
		}

		// If we are out of tests
		if(!this.currentTest) {
			return this.noMoreTests();
		}

		// If we are on a new test
		if(!this.previousTest || (this.previousTest && this.previousTest.fileName != this.currentTest.fileName)) {
			this.onNewTestClass();
		}

		this.emit('TestReporter.startedRunningTestMethod', {
			name: this.currentTest.method,
		});

		// Run .beforeEach on the test class
		yield this.currentTestClass.beforeEach();

		// Create a domain for the test
		var domain = Node.Domain.create();

		// Add an event listener to listen for errors on the domain
		domain.on('error', function(error) {
			//Console.out('Caught unhandled domain error!', error);

			// Stop the stopwatch for the test
			this.currentTestMethodStopwatch.stop();

			// Record the failure
			this.failures++;
			this.failedTests.push({
				'test': this.tests[this.currentTest.name],
				'method': this.currentTest.method,
				'errorObject': error.toObject(),
				'error': error,
			});

			this.currentTestMethodStatus = 'failed';

			this.finishedRunningNextTest(domain);
		}.bind(this));

		// Enter the domain
		domain.enter();

		// Time the test
		this.currentTestMethodStopwatch = new Stopwatch();

		// Put a try catch block around the test
		try {
			// Run the test
			yield this.currentTestClass[this.currentTest.method]();

			// Stop the stopwatch for the test
			this.currentTestMethodStopwatch.stop();

			// Record the pass
			this.passes++;

			this.currentTestMethodStatus = 'passed';

			this.finishedRunningNextTest(domain);
		}
		// If the test fails
		catch(error) {
			// Stop the stopwatch for the test
			this.currentTestMethodStopwatch.stop();

			// Record the failure
			this.failures++;
			this.failedTests.push({
				'test': this.tests[this.currentTest.name],
				'method': this.currentTest.method,
				'errorObject': error.toObject(),
				'error': error,
			});

			this.currentTestMethodStatus = 'failed';

			this.finishedRunningNextTest(domain);
		}
	},

	finishedRunningNextTest: function*(domain) {
		// Exit the domain
		domain.exit();

		// Run .afterEach on the test class
		yield this.currentTestClass.afterEach();

		this.emit('TestReporter.finishedRunningTestMethod', {
			status: this.currentTestMethodStatus,
			name: this.currentTest.method,
			stopwatch: this.currentTestMethodStopwatch,
			failedTests: this.failedTests,
		});

		//yield Function.delay(50);

		this.runNextTest();
	},

	onNewTestClass: function*() {
		// Close out the previous test if we aren't on the very first test
		if(this.currentTestClassStopwatch) {
			// Stop the test class stopwatch and report
			this.currentTestClassStopwatch.stop();

			// Run .after on the test class
			yield this.currentTestClass.after();

			this.emit('TestReporter.finishedRunningTest', {
				name: this.previousTest.name.replaceLast('Test', ''),
			});
		}

		// Start up the new test
		this.emit('TestReporter.startedRunningTest', this.tests[this.currentTest.name]);

		// Get the instantiated test class
		this.currentTestClass = this.testClasses[this.currentTest.name];

		// Run .before on the test class
		yield this.currentTestClass.before();

		// Time all of the tests in the class
		this.currentTestClassStopwatch = new Stopwatch();
	},

	noMoreTests: function() {
		// Stop the stopwatch
		this.stopwatch.stop();

		// Finished running tests
		this.emit('TestReporter.finishedRunningTests', {
			passes: this.passes,
			failures: this.failures,
			stopwatch: this.stopwatch,
			failedTests: this.failedTests,
		});

		// Exit the process
		Node.Process.exit();
	},

	exit: function(message) {
		// Finished running tests
		this.emit('TestReporter.finishedRunningTests');

		Console.out(message+"\n");
		Node.Process.exit();
	},

});