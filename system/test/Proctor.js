// Dependencies
var Test = Framework.require('system/test/Test.js');
var Stopwatch = Framework.require('system/time/Stopwatch.js');
var Terminal = Framework.require('system/console/Terminal.js');
var StandardTestReporter = Framework.require('system/test/test-reporters/StandardTestReporter.js');
var DotTestReporter = Framework.require('system/test/test-reporters/DotTestReporter.js');
var ConciseTestReporter = Framework.require('system/test/test-reporters/ConciseTestReporter.js');
var ElectronTestReporter = Framework.require('system/test/test-reporters/ElectronTestReporter.js');
var FileSystemObject = Framework.require('system/file-system/FileSystemObject.js');
var FileSystemObjectFactory = Framework.require('system/file-system/FileSystemObjectFactory.js');
var AsciiArt = Framework.require('system/ascii-art/AsciiArt.js');

// Class
var Proctor = Class.extend({

	testReporter: null,

	stopwatch: null,

	testMethods: {},
	testMethodQueue: [],
	testClassInstances: {},

	previousTestMethod: null,
	nextTestMethod: null,
	currentTestMethod: null,
	currentTestMethodStopwatch: null,
	currentTestMethodStatus: null,
	currentTestClassStatus: null,
	currentTestClassInstance: null,
	currentTestClassInstanceStopwatch: null,

	passedTestMethods: [],
	passedTestClasses: [],
	failedTestMethods: [],
	failedTestClasses: [],
	skippedTestMethods: [],
	skippedTestClasses: [],

	shouldRunCurrentTestClass: false,

	breakOnError: false,
	
	construct: function(testReporterIdentifier, breakOnError) {
		// Instantiate a test reporter
		if(testReporterIdentifier === undefined) {
			this.testReporter = new StandardTestReporter();
		}
		else if(testReporterIdentifier.lowercase() == 'standard') {
			this.testReporter = new StandardTestReporter();
		}
		else if(testReporterIdentifier.lowercase() == 'dot') {
			this.testReporter = new DotTestReporter();
		}
		else if(testReporterIdentifier.lowercase() == 'concise') {
			this.testReporter = new ConciseTestReporter();
		}
		else if(testReporterIdentifier.lowercase() == 'electron') {
			this.testReporter = new ElectronTestReporter();
		}
		else {
			this.testReporter = new StandardTestReporter();
		}

		// Break on error
		if(breakOnError !== undefined) {
			this.breakOnError = breakOnError;
		}
	},

	supervise: function*() {
		Console.log('Test supervising enabled. Tests will run whenever a test class file is updated.');

		// Keep track of the last test class and methods changed
		var activeTest = {
			class: null,
			method: null, // Will implement this at some point, right now I can't figure out a good way to do
		};
		
		// Watch the project and framework directories
		var watchedFileSystemObjects = yield FileSystemObject.watch([Project.directory, Project.framework.directory], function(fileSystemObject, currentStatus, previousStatus) {
			//Console.log(fileSystemObject.path, 'updated.');

			if(fileSystemObject.path.endsWith('Test.js')) {
				// Set the active test class
				//Console.info(fileSystemObject.path);
				activeTest.class = fileSystemObject.nameWithoutExtension;
				//Console.info(activeTest.class);

				//Console.log("\r\n".repeat(64));

				Console.log(fileSystemObject.path, 'updated.');
				Console.log(Terminal.style(AsciiArt.weapons.swords.samurai.pointingRight, 'blue'));

				// If there is no active test file
				if(!activeTest.class) {
					Console.log(Terminal.style("\r\n"+'Did not run tests, please update (touch) the test class file you would like to run.', 'red'));
					Console.log(Terminal.style(AsciiArt.weapons.swords.samurai.pointingLeft, 'blue'));
				}
				else {
					// Spawn the child process
				    var nodeChildProcess = exports.child = Node.ChildProcess.spawn('node', ['--harmony', Node.Path.join('tests', 'Project.js'), '-f', activeTest.class], {
				    	stdio: 'inherit',
				    });

					nodeChildProcess.on('close', function(code) {
						Console.log(Terminal.style(AsciiArt.weapons.swords.samurai.pointingLeft, 'blue'));
						Console.log('Tests finished. Child process exited with code '+code+'. Will run tests on next file update...'+String.newline);
					});
				}
			}
		});

		// Tell the user how many objects we are watching
		Console.log('Watching', watchedFileSystemObjects.length, 'file system objects for updates...');
	},

	emit: function(eventName, data) {
		Framework.emit(eventName, data);
	},

	resolvePath: function(path) {
		// If the path does not exist, we are in the default Framework tests directory
		if(!path) {
			path = Project.framework.directory;
		}
		// If the path is not absolute, we are in the default Framework tests directory
		else if(!Node.Path.isAbsolute(path)) {
			path = Node.Path.join(Project.framework.directory, 'tests', path);
		}

		return path;
	},

	getAndRunTests: function*(path, filePattern, methodPattern) {
		yield this.getTests(path, filePattern, methodPattern);
		yield this.runTests();
	},

	getTestCount: function() {
		var count = 0;

		this.testMethods.each(function(key, value) {
			count++;
		});

		return count;
	},

	getTestMethodCount: function() {
		var count = 0;

		this.testMethods.each(function(key, value) {
			count = count + value.methods.length;
		});

		return count;
	},

	getTests: function*(path, filePattern, methodPattern) {
		// Resolve the path
		path = this.resolvePath(path);
		//Console.log(path);
		//Node.exit(path);

		// Lowercase strings
		if(String.is(filePattern)) {
			filePattern = filePattern.lowercase();
		}

		// Create a file or directory from the path
		var fileSystemObjectFromPath = yield FileSystemObjectFactory.create(path);
		//Node.exit(fileSystemObject);

		// Store all of the file system objects
		var fileSystemObjects = [];
		
		// If we are working with a directory of tests
		if(fileSystemObjectFromPath.isDirectory()) {
			// Recursively get all of the file system objects in the path
			fileSystemObjects = yield fileSystemObjectFromPath.list(true);
		}
		// If we are working with a single test file
		else {
			fileSystemObjects.append(fileSystemObjectFromPath);
		}

		// Loop through each of the file system objects
		fileSystemObjects.each(function(index, fileSystemObject) {
			//Console.log(fileSystemObject.path);

			// If we have a file
			if(fileSystemObject.isFile()) {
				// We need to see if this is a test class file, if the file is not "Test.js" but ends with "Test.js" it should be
				if(fileSystemObject.name != 'Test.js' && fileSystemObject.name.endsWith('Test.js')) {
					// Filter the tests if there is a filePattern
					if(filePattern == null || fileSystemObject.path.lowercase().match(filePattern)) {
						//Console.info(fileSystemObject.path.lowercase(), 'matched against', filePattern);
						
						var testClassName = fileSystemObject.nameWithoutExtension;

						// Require the test class file
						var testClass = Node.require(fileSystemObject.file);

						// Check to see if the testClass is a function
						if(!testClass || !Function.is(testClass)) {
							throw new Error(fileSystemObject.file+' did not export a Test class.');
						}
						// If testClass is a function that can be instantiated
						else {
							// Instantiate the test class
							var instantiatedTestClass = new testClass();

							// Make sure the instantiated class is an instance of Test
							if(Class.isInstance(instantiatedTestClass, Test)) {
								//Console.log('Adding test:', testClassName);

								// Add the test class to tests
								this.addTest(testClassName, fileSystemObject.name, fileSystemObject.directory);
								this.testClassInstances[testClassName] = instantiatedTestClass;

								// Loop through all of the class properties
								for(var key in instantiatedTestClass) {
									// All tests must start with "test" and be a function
									if(key.startsWith('test') && Function.is(instantiatedTestClass[key])) {
										// Filter test methods
										if(methodPattern == null || key.lowercase().match(methodPattern)) {
											//Console.log(key.lowercase(), 'matched against', methodPattern);
											this.testMethods[testClassName].methods.append(key);
										}
										else {
											//Console.log(key.lowercase(), 'did not match against', methodPattern);
										}
									}
								}
							}
							else {
								throw new Error(fileSystemObject.file+' did not export a Test class.');
							}
						}
					}
					else {
						//Console.log(fileSystemObject.path.lowercase(), 'did not match against', filePattern);
					}
				}
			}
		}.bind(this));

		return this;
	},

	addTest: function(name, fileName, directory) {
		if(!this.testMethods[name]) {
			this.testMethods[name] = {
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
		this.testMethods.each(function(testClassName, test) {
			test.methods.each(function(filePatternIndex, filePattern) {
				// Build a new structure for tests in the test queue
				var testToAddToQueue = {
					method: filePattern,
				};

				// Bring in all of the properties of the test
				testToAddToQueue.merge(test.clone());

				// Except for the methods property
				delete testToAddToQueue['methods'];

				// Add the test to the queue
				this.testMethodQueue.push(testToAddToQueue);
			}.bind(this));
		}.bind(this));
	},

	runTests: function*() {
		// Get the totals
		var testCount = this.getTestCount();
		var testMethodCount = this.getTestMethodCount();

		// Build the test queue
		this.buildTestQueue();
		//Console.log(this.testMethodQueue);

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

	moveToNextTest: function() {
		// Set the first test
		if(!this.currentTestMethod && !this.testMethodQueue.isEmpty()) {
			this.previousTestMethod = null;
			this.currentTestMethod = this.testMethodQueue.first();
			this.nextTestMethod = this.testMethodQueue.get(1);
		}
		// If we aren't on the first test, move on to the next test
		else if(this.currentTestMethod) {
			this.previousTestMethod = this.currentTestMethod;

			// Remove the first test off of the test queue
			this.testMethodQueue.shift();

			this.currentTestMethod = this.testMethodQueue.first();
			this.nextTestMethod = this.testMethodQueue.get(1);
		}
	},

	skipCurrentTest: function() {
		//Console.log('Skipping this.currentTestMethod', this.currentTestMethod);

		this.currentTestMethodStatus = 'skipped';
		this.currentTestClassStatus = 'skipped';

		this.skippedTestMethods.append(this.currentTestMethod);

		this.emit('TestReporter.finishedRunningTestMethod', {
			status: this.currentTestMethodStatus,
			name: this.currentTestMethod.method,
			stopwatch: null,
			failedTestMethods: null,
		});

		return this.runNextTest();
	},

	runNextTest: function*() {
		this.moveToNextTest();

		// If we are out of tests
		if(!this.currentTestMethod) {
			return this.noMoreTests();
		}

		// If we are on a new test
		if(!this.previousTestMethod || (this.previousTestMethod && this.previousTestMethod.fileName != this.currentTestMethod.fileName)) {
			// This method sets this.shouldRunCurrentTestClass
			yield this.onNewTestClass();
		}

		// If we shouldn't run this test
		if(!this.shouldRunCurrentTestClass) {
			// Skip tests until we get to the next test class (or end of all tests)
			return this.skipCurrentTest();
		}

		this.emit('TestReporter.startedRunningTestMethod', {
			name: this.currentTestMethod.method,
		});

		// Run .beforeEach on the test class
		yield this.currentTestClassInstance.beforeEach();

		// Create a domain for the test
		var domain = Node.Domain.create();

		// Add an event listener to listen for errors on the domain
		domain.on('error', function(error) {
			//Console.warn('Caught domain error', error); Node.exit();

			this.failCurrentTestMethod(error, domain);
		}.bind(this));

		// Enter the domain
		domain.enter();

		// Time the test
		this.currentTestMethodStopwatch = new Stopwatch();

		// Put a try catch block around the test
		try {
			// Run the test
			yield this.currentTestClassInstance[this.currentTestMethod.method]();

			this.passCurrentTestMethod(domain);
		}
		// If the test fails
		catch(error) {
			//Console.warn('Caught error', error); Node.exit();

			this.failCurrentTestMethod(error, domain);
		}
	},

	passCurrentTestMethod: function(domain) {
		// Stop the stopwatch for the test
		this.currentTestMethodStopwatch.stop();

		// Record the pass
		this.passedTestMethods.append(this.currentTestMethod);

		this.currentTestMethodStatus = 'passed';

		this.finishedRunningNextTest(domain);
	},

	failCurrentTestMethod: function(error, domain) {
		// Stop the stopwatch for the test
		this.currentTestMethodStopwatch.stop();

		// Record the failure
		this.failedTestMethods.push({
			'test': this.testMethods[this.currentTestMethod.name],
			'method': this.currentTestMethod.method,
			'error': error,
		});

		this.currentTestMethodStatus = 'failed';
		this.currentTestClassStatus = 'failed';

		this.finishedRunningNextTest(domain);
	},

	finishedRunningNextTest: function*(domain) {
		// Exit the domain
		domain.exit();

		// Run .afterEach on the test class
		yield this.currentTestClassInstance.afterEach();

		this.emit('TestReporter.finishedRunningTestMethod', {
			status: this.currentTestMethodStatus,
			name: this.currentTestMethod.method,
			stopwatch: this.currentTestMethodStopwatch,
			failedTestMethods: this.failedTestMethods,
		});

		//yield Function.delay(50);

		// Break on errors if we should
		if(this.breakOnError && this.failedTestMethods.length) {
			this.noMoreTests();
		}
		else {
			this.runNextTest();
		}
	},

	onNewTestClass: function*() {
		// Close out the previous test if we aren't on the very first test
		if(this.currentTestClassInstanceStopwatch) {
			// Stop the test class stopwatch and report
			this.currentTestClassInstanceStopwatch.stop();

			// Run .after on the test class
			yield this.currentTestClassInstance.after();

			this.emit('TestReporter.finishedRunningTest', {
				name: this.previousTestMethod.name.replaceLast('Test', ''),
			});

			// Store passing, failing, and skipped test classes
			this.recordCurrentTestClassStatus();

			// Reset
			this.currentTestClassStatus = 'passed';
		}

		// Prepare for the new test
		this.currentTestClassStatus = 'passed';

		// Start up the new test
		this.emit('TestReporter.startedRunningTest', this.testMethods[this.currentTestMethod.name]);

		// Get the instantiated test class
		this.currentTestClassInstance = this.testClassInstances[this.currentTestMethod.name];

		// Check to see if we should run the test
		this.shouldRunCurrentTestClass = yield this.currentTestClassInstance.shouldRun();

		// Time all of the tests in the class
		this.currentTestClassInstanceStopwatch = new Stopwatch();

		if(this.shouldRunCurrentTestClass) {
			// Run .before on the test class
			yield this.currentTestClassInstance.before();
		}
	},

	recordCurrentTestClassStatus: function() {
		var testMethod = this.previousTestMethod;
		// In case the first test is failing	
		if(!testMethod) {
			testMethod = this.currentTestMethod;
		}

		// Store passing, failing, and skipped test classes
		if(this.currentTestClassStatus == 'failed') {
			this.failedTestClasses.append(testMethod.name);
		}
		else if(this.currentTestClassStatus == 'passed') {
			this.passedTestClasses.append(testMethod.name);
		}
		else if(this.currentTestClassStatus == 'skipped') {
			this.skippedTestClasses.append(testMethod.name);
		}
	},

	noMoreTests: function() {
		//Console.log('noMoreTests');

		// Store passing, failing, and skipped test classes
		this.recordCurrentTestClassStatus();

		// Stop the stopwatch
		this.stopwatch.stop();

		// Check for leaked globals
		var leakedGlobals = this.getLeakedGlobals();

		// Finished running tests
		this.emit('TestReporter.finishedRunningTests', {
			stopwatch: this.stopwatch,
			passedTestMethods: this.passedTestMethods,
			passedTestClasses: this.passedTestClasses,
			failedTestMethods: this.failedTestMethods,
			failedTestClasses: this.failedTestClasses,
			skippedTestMethods: this.skippedTestMethods,
			skippedTestClasses: this.skippedTestClasses,
			leakedGlobals: leakedGlobals,
		});

		//Console.log('noMoreTests');

		// Exit the process if we are on a terminal
		if(Console.onTerminal()) {
			// Give the console session logger some time to finish writing to disk
			Function.delay(250, function() {
				Node.exit();
			});
		}
	},

	getLeakedGlobals: function() {
		var leakedGlobals = [];

		for(var key in global) {
			if(!Proctor.globals.expected.contains(key, true)) {
				leakedGlobals.append(key);	
			}
		}

		return leakedGlobals;
	},

});

// Static properties

Proctor.globals = {
	expected: [
		'Console',
		'GLOBAL',
		'Generator',
		'Json',
		'Node',
		'Primitive',
		'Project',
		'console',
		'global',
		'length',
		'process',
		'root',
		'Buffer',
		'Class',
		'DTRACE_HTTP_CLIENT_REQUEST',
		'DTRACE_HTTP_CLIENT_RESPONSE',
		'DTRACE_HTTP_SERVER_REQUEST',
		'DTRACE_HTTP_SERVER_RESPONSE',
		'DTRACE_NET_SERVER_CONNECTION',
		'DTRACE_NET_STREAM_END',
		'Framework',
		'RegularExpression',
		'Stream',
		'Time',
		'clearImmediate',
		'clearInterval',
		'clearTimeout',
		'clone',
		'each',
		'getValueByPath',
		'getValueForKey',
		'hasKey',
		'integrate',
		'isEmpty',
		'merge',
		'setImmediate',
		'setInterval',
		'setTimeout',
		'setValueByPath',
		'sort',
		'toArray',
		'toJson',

		// Windows
		'COUNTER_NET_SERVER_CONNECTION',
		'COUNTER_NET_SERVER_CONNECTION_CLOSE',
		'COUNTER_HTTP_SERVER_REQUEST',
		'COUNTER_HTTP_SERVER_RESPONSE',
		'COUNTER_HTTP_CLIENT_REQUEST',
		'COUNTER_HTTP_CLIENT_RESPONSE',

		// Electron
		'document',
		'require',
		'module',
		'__filename',
		'__dirname',
		'P',
		'WebView',
		'speechSynthesis',
		'caches',
		'localStorage',
		'sessionStorage',
		'webkitStorageInfo',
		'indexedDB',
		'webkitIndexedDB',
		'ondeviceorientation',
		'ondevicemotion',
		'crypto',
		'postMessage',
		'blur',
		'focus',
		'close',
		'applicationCache',
		'performance',
		'onunload',
		'onstorage',
		'onpopstate',
		'onpageshow',
		'onpagehide',
		'ononline',
		'onoffline',
		'onmessage',
		'onlanguagechange',
		'onhashchange',
		'onbeforeunload',
		'onwaiting',
		'onvolumechange',
		'ontoggle',
		'ontimeupdate',
		'onsuspend',
		'onsubmit',
		'onstalled',
		'onshow',
		'onselect',
		'onseeking',
		'onseeked',
		'onscroll',
		'onresize',
		'onreset',
		'onratechange',
		'onprogress',
		'onplaying',
		'onplay',
		'onpause',
		'onmousewheel',
		'onmouseup',
		'onmouseover',
		'onmouseout',
		'onmousemove',
		'onmouseleave',
		'onmouseenter',
		'onmousedown',
		'onloadstart',
		'onloadedmetadata',
		'onloadeddata',
		'onload',
		'onkeyup',
		'onkeypress',
		'onkeydown',
		'oninvalid',
		'oninput',
		'onfocus',
		'onerror',
		'onended',
		'onemptied',
		'ondurationchange',
		'ondrop',
		'ondragstart',
		'ondragover',
		'ondragleave',
		'ondragenter',
		'ondragend',
		'ondrag',
		'ondblclick',
		'oncuechange',
		'oncontextmenu',
		'onclose',
		'onclick',
		'onchange',
		'oncanplaythrough',
		'oncanplay',
		'oncancel',
		'onblur',
		'onabort',
		'isSecureContext',
		'onwheel',
		'onwebkittransitionend',
		'onwebkitanimationstart',
		'onwebkitanimationiteration',
		'onwebkitanimationend',
		'ontransitionend',
		'onsearch',
		'onanimationstart',
		'onanimationiteration',
		'onanimationend',
		'styleMedia',
		'defaultstatus',
		'defaultStatus',
		'screenTop',
		'screenLeft',
		'clientInformation',
		'devicePixelRatio',
		'outerHeight',
		'outerWidth',
		'screenY',
		'screenX',
		'pageYOffset',
		'scrollY',
		'pageXOffset',
		'scrollX',
		'innerHeight',
		'innerWidth',
		'screen',
		'navigator',
		'frameElement',
		'parent',
		'opener',
		'top',
		'frames',
		'closed',
		'status',
		'toolbar',
		'statusbar',
		'scrollbars',
		'personalbar',
		'menubar',
		'locationbar',
		'history',
		'location',
		'name',
		'self',
		'window',
		'stop',
		'open',
		'alert',
		'confirm',
		'prompt',
		'print',
		'requestAnimationFrame',
		'cancelAnimationFrame',
		'captureEvents',
		'releaseEvents',
		'getComputedStyle',
		'matchMedia',
		'moveTo',
		'moveBy',
		'resizeTo',
		'resizeBy',
		'getSelection',
		'find',
		'getMatchedCSSRules',
		'webkitRequestAnimationFrame',
		'webkitCancelAnimationFrame',
		'webkitCancelRequestAnimationFrame',
		'btoa',
		'atob',
		'requestIdleCallback',
		'cancelIdleCallback',
		'scroll',
		'scrollTo',
		'scrollBy',
		'fetch',
		'webkitRequestFileSystem',
		'webkitResolveLocalFileSystemURL',
		'openDatabase',
		'TEMPORARY',
		'PERSISTENT',
		'addEventListener',
		'removeEventListener',
		'dispatchEvent',
	],
	leaked: [],
};

// Export
module.exports = Proctor;