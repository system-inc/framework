Proctor = Class.extend({

	tests: {},
	failedTests: [],
	testClasses: {},

	passes: 0,
	failures: 0,

	testReporter: null,
	
	construct: function() {
		// Configure the console
		Console.showTime = false;
		Console.showFile = false;

		// Instantiate a test reporter
		this.testReporter = new StandardTestReporter();
	},

	emit: function(eventName, data) {
		Framework.emit(eventName, data);
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
		if(path.endsWith('/')) {
			// Recursively get all of the file system objects in the path
			var fileSystemObjects = yield FileSystem.list(path, true);

			// Loop through each of the file system objects
			fileSystemObjects.each(function(index, fileSystemObject) {
				// If we have a file
				if(Class.is(fileSystemObject, File)) {
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

	runTests: function*() {
		// Get the totals
		var testCount = this.getTestCount();
		var testMethodCount = this.getTestMethodCount();

		// Started running tests
		this.emit('TestReporter.startedRunningTests', {
			testCount: testCount,
			testMethodCount: testMethodCount,
		});

		// Start the stopwatch
		var stopwatch = new Stopwatch();

		// Loop through all of the test classes
		yield this.tests.each(function*(testClassName, test) {
			this.emit('TestReporter.startedRunningTest', {
				name: testClassName,
			});

			// Get the instantiated test class
			var testClass = this.testClasses[testClassName];

			// Run .before on the test class
			yield testClass.before();

			// Time all of the tests in the class
			var testClassStopwatch = new Stopwatch();

			// Loop through all of the test methods
			yield test.methods.each(function*(testMethodNameIndex, testMethodName) {
				this.emit('TestReporter.startedRunningTestMethod', {
					name: testMethodName,
				});

				// Run .beforeEach on the test class
				yield testClass.beforeEach();

				// Store the test method status
				var testMethodStatus;

				// Create a domain for the test
				var domain = Node.Domain.create();

				// Add an event listener to listen for errors on the domain
				domain.on('error', function(error) {
					Console.out('Caught unhandled domain error!', error);

					// Exit the domain
					domain.exit();
				}.bind(this));

				// Enter the domain
				domain.enter();

				// Time the test
				var testMethodStopwatch = new Stopwatch();

				// Put a try catch block around the test
				try {
					// Run the test
					yield testClass[testMethodName]();

					// Stop the stopwatch for the test
					testMethodStopwatch.stop();

					// Record the pass
					this.passes++;

					testMethodStatus = 'passed';

					// Exit the domain
					domain.exit();
				}
				// If the test fails
				catch(error) {
					// Stop the stopwatch for the test
					testMethodStopwatch.stop();

					// Record the failure
					this.failures++;
					this.failedTests.push({
						'test': test,
						'method': testMethodName,
						'errorObject': error.toObject(),
						'error': error,
					});

					testMethodStatus = 'failed';

					// Exit the domain
					domain.exit();
				}

				// Run .afterEach on the test class
				yield testClass.afterEach();

				this.emit('TestReporter.finishedRunningTestMethod', {
					status: testMethodStatus,
					name: testMethodName,
					stopwatch: testMethodStopwatch,
					failedTests: this.failedTests,
				});
			}, this);
			
			// Stop the test class stopwatch and report
			testClassStopwatch.stop();

			// Run .after on the test class
			yield testClass.after();

			this.emit('TestReporter.finishedRunningTest', {
				name: testClassName.replaceLast('Test', ''),
			});
		}, this);

		// Stop the stopwatch
		stopwatch.stop();

		// Finished running tests
		this.emit('TestReporter.finishedRunningTests', {
			passes: this.passes,
			failures: this.failures,
			stopwatch: stopwatch,
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