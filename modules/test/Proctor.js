Proctor = Class.extend({

	tests: {},
	failedTests: [],
	testClasses: {},

	passes: 0,
	failures: 0,
	
	construct: function() {
		// Configure the console
		Console.showTime = false;
		Console.showFile = false;

		// Clear the screen
		//Console.write('\033[2J');
		//Console.write('\033[H');
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
				if(fileSystemObject.is(File)) {
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
		// Clear the terminal
		Terminal.clear();

		// Tell the user what we are doing
		var testCount = this.getTestCount();
		var testMethodCount = this.getTestMethodCount();
		Console.out('Running '+testMethodCount+' '+(testMethodCount == 1 ? 'test' : 'tests')+' in '+testCount+' test '+(testCount == 1 ? 'class' : 'classes')+'...');

		// Start the stopwatch
		var stopwatch = new Stopwatch();

		// Loop through all of the test classes
		yield this.tests.each(function*(testClassName, test) {
			// Get the instantiated test class
			var testClass = this.testClasses[testClassName];

			// Run .before on the test class
			yield testClass.before();

			// Time all of the tests in the class
			var testClassStopwatch = new Stopwatch();

			// Print out the current class
			Console.out("\n"+'  '+testClassName.replaceLast('Test', '')+"\n");

			// If there are no test methods
			if(test.methods.length == 0) {
				Console.out(Terminal.style('    No test methods found. Make sure to prefix test method names with "test", e.g., "testMethod".', 'gray'));
			}
			else {
				// Loop through all of the test methods
				yield test.methods.each(function*(testMethodNameIndex, testMethodName) {
					// Run .beforeEach on the test class
					yield testClass.beforeEach();

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

						// Count the number of assertions
						var assertions = 'x';

						// Report the test
						Console.out('    '+Terminal.style('✓', 'green')+' '+testMethodName.replaceFirst('test', '').lowercaseFirstCharacter()+' '+this.getElapsedTimeString(testMethodStopwatch.elapsedTime, testMethodStopwatch.time.precision, true, 5, 30));
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
							'error': error,
						});

						// Report the test
						Console.out('    '+Terminal.style('✗ ('+this.failedTests.length+') '+testMethodName.replaceFirst('test', '').lowercaseFirstCharacter()+' '+this.getElapsedTimeString(testMethodStopwatch.elapsedTime, testMethodStopwatch.time.precision, true, 5, 30), 'red'));
					}

					// Run .afterEach on the test class
					yield testClass.afterEach();
				}, this);
			}
			
			// Stop the test class stopwatch and report
			testClassStopwatch.stop();
			//Console.out("\n"+'    '+this.getElapsedTimeString(testClassStopwatch.elapsedTime, testClassStopwatch.time.precision));	

			// Run .after on the test class
			yield testClass.after();
		}, this);

		// Stop the stopwatch
		stopwatch.stop();

		// Report totals
		Console.out(Terminal.style("\n"+this.passes+' passing', 'green')+' '+this.getElapsedTimeString(stopwatch.elapsedTime, stopwatch.time.precision));
		
		if(this.failures > 0) {
			Console.out(Terminal.style(this.failures+' failing', 'red'));

			this.failedTests.each(function(index, failedTest) {
				Console.out("\n"+'('+(index + 1)+') '+ failedTest.test.name+'.'+failedTest.method+'() '+Terminal.style('('+failedTest.test.directory+failedTest.test.fileName+')', 'gray')+"\n");
				Console.out(Terminal.style(Console.prepareMessage.call(this, [failedTest.error]), 'gray'));
			});
		}
		//, '+this.failures+' failed '+);

		// Exit the process
		Console.out('');
		Node.Process.exit();
	},

	exit: function(message) {
		Console.out(message+"\n");
		Node.Process.exit();
	},

});