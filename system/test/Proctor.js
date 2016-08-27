// Dependencies
import EventEmitter from './../../system/events/EventEmitter.js';
import Test from './Test.js';
import Stopwatch from './../../system/time/Stopwatch.js';
import Terminal from './../../system/console/Terminal.js';
import StandardTestReporter from './test-reporters/StandardTestReporter.js';
import DotTestReporter from './test-reporters/DotTestReporter.js';
import ConciseTestReporter from './test-reporters/ConciseTestReporter.js';
import ElectronTestReporter from './test-reporters/ElectronTestReporter.js';
import FileSystemObject from './../../system/file-system/FileSystemObject.js';
import FileSystemObjectFactory from './../../system/file-system/FileSystemObjectFactory.js';
import AsciiArt from './../../system/ascii-art/AsciiArt.js';

// Class
class Proctor extends EventEmitter {

	testReporter = null;

	stopwatch = null;

	testMethods = {};
	testMethodQueue = [];
	testClassInstances = {};

	previousTestMethod = null;
	nextTestMethod = null;
	currentTestMethod = null;
	currentTestMethodStopwatch = null;
	currentTestMethodStatus = null;
	currentTestClassStatus = null;
	currentTestClassInstance = null;
	currentTestClassInstanceStopwatch = null;

	passedTestMethods = [];
	passedTestClasses = [];
	failedTestMethods = [];
	failedTestClasses = [];
	skippedTestMethods = [];
	skippedTestClasses = [];

	shouldRunCurrentTestClass = false;

	breakOnError = false;
	
	constructor(testReporterIdentifier, breakOnError) {
		super();

		// Instantiate a test reporter
		if(testReporterIdentifier === undefined) {
			this.testReporter = new StandardTestReporter(this);
		}
		else if(testReporterIdentifier.lowercase() == 'standard') {
			this.testReporter = new StandardTestReporter(this);
		}
		else if(testReporterIdentifier.lowercase() == 'dot') {
			this.testReporter = new DotTestReporter(this);
		}
		else if(testReporterIdentifier.lowercase() == 'concise') {
			this.testReporter = new ConciseTestReporter(this);
		}
		else if(testReporterIdentifier.lowercase() == 'electron') {
			this.testReporter = new ElectronTestReporter(this);
		}
		else {
			this.testReporter = new StandardTestReporter(this);
		}
		//app.log('this.testReporter', this.testReporter);

		// Break on error
		if(breakOnError !== undefined) {
			this.breakOnError = breakOnError;
		}
	}

	async supervise() {
		app.log('Test supervising enabled. Tests will run whenever a test class file is updated.');

		// Keep track of the last test class and methods changed
		var activeTest = {
			class: null,
			method: null, // Will implement this at some point, right now I can't figure out a good way to do
		};
		
		// Watch the project and framework directories
		var watchedFileSystemObjects = await FileSystemObject.watch([app.directory, app.framework.directory], function(fileSystemObject, currentStatus, previousStatus) {
			//app.log(fileSystemObject.path, 'updated.');

			if(fileSystemObject.path.endsWith('Test.js')) {
				// Set the active test class
				//app.info(fileSystemObject.path);
				activeTest.class = fileSystemObject.nameWithoutExtension;
				//app.info(activeTest.class);

				//app.log("\r\n".repeat(64));

				app.log(fileSystemObject.path, 'updated.');
				app.log(Terminal.style(AsciiArt.weapons.swords.samurai.pointingRight, 'blue'));

				// If there is no active test file
				if(!activeTest.class) {
					app.log(Terminal.style("\r\n"+'Did not run tests, please update (touch) the test class file you would like to run.', 'red'));
					app.log(Terminal.style(AsciiArt.weapons.swords.samurai.pointingLeft, 'blue'));
				}
				else {
					// Spawn the child process
				    var nodeChildProcess = exports.child = Node.ChildProcess.spawn('node', ['--harmony', Node.Path.join('tests', 'app.js'), '-f', activeTest.class], {
				    	stdio: 'inherit',
				    });

					nodeChildProcess.on('close', function(code) {
						app.log(Terminal.style(AsciiArt.weapons.swords.samurai.pointingLeft, 'blue'));
						app.log('Tests finished. Child process exited with code '+code+'. Will run tests on next file update...'+String.newline);
					});
				}
			}
		});

		// Tell the user how many objects we are watching
		app.log('Watching', watchedFileSystemObjects.length, 'file system objects for updates...');
	}

	async getAndRunTests(path, filePattern, methodPattern) {
		//app.log('getAndRunTests', ...arguments);
		var tests = await Proctor.getTests(path, filePattern, methodPattern);
		//app.log('getAndRunTests', path, filePattern, methodPattern, tests);

		this.addTests(tests);

		await this.runTests();
	}

	async getAndRunTestMethod(testClassFilePath, testClassName, testMethodName) {
		var tests = await Proctor.getTestMethod(testClassFilePath, testClassName, testMethodName);
		//Console.standardLog('getAndRunTestMethod', testClassFilePath, testClassName, testMethodName);

		this.addTests(tests);

		await this.runTests();
	}

	addTests(tests) {
		tests.classes.each(function(classIndex, classObject) {
			this.addTest(classObject.name, classObject.file.name, classObject.file.directory);
			this.testClassInstances[classObject.name] = classObject.instance;
		}.bind(this));

		tests.methods.each(function(methodIndex, methodObject) {
			//app.log(methodObject.name);
			this.testMethods[methodObject.class.name].methods.append(methodObject.name);
		}.bind(this));
	}

	get testCount() {
		var count = 0;

		this.testMethods.each(function(key, value) {
			count++;
		});

		return count;
	}

	get testMethodCount() {
		var count = 0;

		this.testMethods.each(function(key, value) {
			count = count + value.methods.length;
		});

		return count;
	}

	addTest(name, fileName, directory) {
		if(!this.testMethods[name]) {
			this.testMethods[name] = {
				'name': name,
				'fileName': fileName,
				'directory': directory,
				'methods': [],
			};
		}
	}

	getElapsedTimeString(elapsedTime, precision, useThresholds, warningThreshold, errorThreshhold) {
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
	}

	buildTestQueue() {
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
	}

	async runTests() {
		// Build the test queue
		this.buildTestQueue();
		//app.log('this.testMethodQueue', this.testMethodQueue);

		// Started running tests
		this.emit('Proctor.startedRunningTests', {
			testCount: this.testCount,
			testMethodCount: this.testMethodCount,
		});

		// Start the stopwatch
		this.stopwatch = new Stopwatch();

		// Run the next test
		this.runNextTest();
	}

	moveToNextTest() {
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
	}

	skipCurrentTest() {
		//app.log('Skipping this.currentTestMethod', this.currentTestMethod);

		this.currentTestMethodStatus = 'skipped';
		this.currentTestClassStatus = 'skipped';

		this.skippedTestMethods.append(this.currentTestMethod);

		this.emit('Proctor.finishedRunningTestMethod', {
			status: this.currentTestMethodStatus,
			name: this.currentTestMethod.method,
			stopwatch: null,
			failedTestMethods: null,
		});

		return this.runNextTest();
	}

	async runNextTest() {
		//app.log('runNextTest');

		this.moveToNextTest();

		// If we are out of tests
		if(!this.currentTestMethod) {
			return this.noMoreTests();
		}

		// If we are on a new test
		if(!this.previousTestMethod || (this.previousTestMethod && this.previousTestMethod.fileName != this.currentTestMethod.fileName)) {
			// This method sets this.shouldRunCurrentTestClass
			await this.onNewTestClass();
		}

		// If we shouldn't run this test
		if(!this.shouldRunCurrentTestClass) {
			// Skip tests until we get to the next test class (or end of all tests)
			return this.skipCurrentTest();
		}

		this.emit('Proctor.startedRunningTestMethod', {
			name: this.currentTestMethod.method,
		});

		// Run .beforeEach on the test class
		await this.currentTestClassInstance.beforeEach();

		// Time the test
		this.currentTestMethodStopwatch = new Stopwatch();

		// Run the test
		try {
			app.info('Proctor.runNextTest running test', this.currentTestMethod.method);
			await this.currentTestClassInstance[this.currentTestMethod.method]();
			app.info('Proctor.runNextTest running test completed', this.currentTestMethod.method);

			this.passCurrentTestMethod();
		}
		catch(error) {
			//app.warn('Caught error', error);
			this.failCurrentTestMethod(error);
		}
	}

	passCurrentTestMethod() {
		// Stop the stopwatch for the test
		this.currentTestMethodStopwatch.stop();

		// Record the pass
		this.passedTestMethods.append(this.currentTestMethod);

		this.currentTestMethodStatus = 'passed';

		this.finishedRunningNextTest();
	}

	failCurrentTestMethod(error) {
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

		this.finishedRunningNextTest();
	}

	async finishedRunningNextTest() {
		// Run .afterEach on the test class
		await this.currentTestClassInstance.afterEach();

		this.emit('Proctor.finishedRunningTestMethod', {
			status: this.currentTestMethodStatus,
			name: this.currentTestMethod.method,
			stopwatch: this.currentTestMethodStopwatch,
			failedTestMethods: this.failedTestMethods,
		});

		//await Function.delay(50);

		// Break on errors if we should
		if(this.breakOnError && this.failedTestMethods.length) {
			this.noMoreTests();
		}
		else {
			this.runNextTest();
		}
	}

	async onNewTestClass() {
		// Close out the previous test if we aren't on the very first test
		if(this.currentTestClassInstanceStopwatch) {
			// Stop the test class stopwatch and report
			this.currentTestClassInstanceStopwatch.stop();

			// Run .after on the test class
			await this.currentTestClassInstance.after();

			this.emit('Proctor.finishedRunningTest', {
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
		this.emit('Proctor.startedRunningTest', this.testMethods[this.currentTestMethod.name]);

		// Get the instantiated test class
		this.currentTestClassInstance = this.testClassInstances[this.currentTestMethod.name];

		// Check to see if we should run the test
		this.shouldRunCurrentTestClass = await this.currentTestClassInstance.shouldRun();

		// Time all of the tests in the class
		this.currentTestClassInstanceStopwatch = new Stopwatch();

		if(this.shouldRunCurrentTestClass) {
			// Run .before on the test class
			await this.currentTestClassInstance.before();
		}
	}

	recordCurrentTestClassStatus() {
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
	}

	noMoreTests() {
		//app.log('noMoreTests');

		// Store passing, failing, and skipped test classes
		this.recordCurrentTestClassStatus();

		// Stop the stopwatch
		this.stopwatch.stop();

		// Check for leaked globals
		var leakedGlobals = this.getLeakedGlobals();

		// Finished running tests
		this.emit('Proctor.finishedRunningTests', {
			stopwatch: this.stopwatch,
			passedTestMethods: this.passedTestMethods,
			passedTestClasses: this.passedTestClasses,
			failedTestMethods: this.failedTestMethods,
			failedTestClasses: this.failedTestClasses,
			skippedTestMethods: this.skippedTestMethods,
			skippedTestClasses: this.skippedTestClasses,
			leakedGlobals: leakedGlobals,
		});

		//app.log('noMoreTests');

		// Exit the process if we are on a terminal
		app.log('need to fix this next block'); Node.exit();
		//if(Console.onTerminal()) {
		//	// Give the console session logger some time to finish writing to disk
		//	Function.delay(250, function() {
		//		Node.exit();
		//	});
		//}
	}

	getLeakedGlobals() {
		var leakedGlobals = [];

		for(var key in global) {
			if(!Proctor.globals.expected.contains(key, true)) {
				leakedGlobals.append(key);	
			}
		}

		return leakedGlobals;
	}

	static globals = {
		expected: [
			// Framework
			'Console',
			'Generator',
			'Json',
			'Node',
			'Primitive',
			'Project',
			'Buffer',
			'Class',
			'Framework',
			'RegularExpression',
			'Stream',
			'Time',
			'Try',

			// Framework - Object
			'clone',
			'deleteValueByPath',
			'each',
			'getValueByPath',
			'getValueForKey',
			'hasKey',
			'integrate',
			'isEmpty',
			'merge',
			'setValueByPath',
			'sort',
			'toArray',
			'toJson',

			// Framework - Electron
			'mainBrowserWindowViewController',

			// Node
			'GLOBAL',
			'console',
			'global',
			'length',
			'process',
			'root',
			'clearImmediate',
			'clearInterval',
			'clearTimeout',
			'setImmediate',
			'setInterval',
			'setTimeout',
			'DTRACE_HTTP_CLIENT_REQUEST',
			'DTRACE_HTTP_CLIENT_RESPONSE',
			'DTRACE_HTTP_SERVER_REQUEST',
			'DTRACE_HTTP_SERVER_RESPONSE',
			'DTRACE_NET_SERVER_CONNECTION',
			'DTRACE_NET_STREAM_END',

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
			'onunhandledrejection',
			'onrejectionhandled',
			'ondeviceorientationabsolute',
			'createImageBitmap',
		],
		leaked: [],
	};

	static resolvePath(path) {
		// If the path does not exist, we are in the default Framework tests directory
		if(!path) {
			path = app.framework.directory;
		}
		// If the path is not absolute, we are in the default Framework tests directory
		else if(!Node.Path.isAbsolute(path)) {
			path = Node.Path.join(app.framework.directory, 'tests', path);
		}

		return path;
	}

	static async getTestMethod(testClassFilePath, testClassName, testMethodName) {
		var tests = await Proctor.getTests(testClassFilePath, testClassName, testMethodName, true);

		return tests;
	}

	static async getTests(path, filePattern, methodPattern, matchStringMethodPatternExactly) {
		//app.log('Proctor.getTests', ...arguments);

		var tests = {
			classes: [],
			methods: [],
		};

		// Resolve the path
		path = Proctor.resolvePath(path);
		//app.log(path);
		//Node.exit(path);

		// If patterns are set and are strings, lowercase them for later matching
		if(filePattern && String.is(filePattern)) {
			filePattern = filePattern.lowercase();
		}
		if(methodPattern && String.is(methodPattern)) {
			methodPattern = methodPattern.lowercase();	
		}

		// Create a file or directory object from the path
		var fileSystemObjectFromPath = await FileSystemObjectFactory.create(path);
		//app.log('fileSystemObjectFromPath', fileSystemObjectFromPath);

		// Store all of the file system objects
		var fileSystemObjects = [];
		
		// If we are working with a directory of tests
		if(fileSystemObjectFromPath.isDirectory()) {
			//app.log('fileSystemObjectFromPath.isDirectory');

			// Recursively get all of the file system objects in the path
			//app.log('Proctor getting all file system objects');
			fileSystemObjects = await fileSystemObjectFromPath.list(true);
			//app.log('fileSystemObjects', fileSystemObjects);
		}
		// If we are working with a single test file
		else {
			fileSystemObjects.append(fileSystemObjectFromPath);
		}
		//app.log('fileSystemObjects', fileSystemObjects);

		// Loop through each of the file system objects
		fileSystemObjects.each(function(index, fileSystemObject) {
			//app.log(fileSystemObject.path);

			// If we have a file
			if(fileSystemObject.isFile()) {
				// We need to see if this is a test class file, if the file is not "Test.js" but ends with "Test.js" it should be
				if(fileSystemObject.name != 'Test.js' && fileSystemObject.name.endsWith('Test.js')) {
					// Filter the tests if there is a filePattern
					if(filePattern == null || fileSystemObject.path.lowercase().match(filePattern)) {
						//app.info(fileSystemObject.path.lowercase(), 'matched against', filePattern);
						
						var testClassName = fileSystemObject.nameWithoutExtension;

						// Require the test class file
						try {
							var testClass = require(fileSystemObject.file).default;
							//app.log('testClass', testClass);

							// Check to see if the testClass is a class
							if(!testClass || !Class.is(testClass)) {
								throw new Error(fileSystemObject.file+' did not export a Test class.');
							}
							// If testClass is a class that can be instantiated
							else {
								// Instantiate the test class
								var instantiatedTestClass = new testClass();
								//app.log('instantiatedTestClass', instantiatedTestClass);

								// Make sure the instantiated class is an instance of Test
								if(Class.isInstance(instantiatedTestClass, Test)) {
									//app.log('Adding test:', testClassName);

									// Add the test class to tests
									var testClassObject = {
										name: testClassName,
										instance: instantiatedTestClass,
										class: testClass,
										file: fileSystemObject,
									};
									tests.classes.append(testClassObject);

									// Loop through all of the class properties
									var testClassMethodNames = Class.getMethodNames(testClass);
									testClassMethodNames.each(function(testClassMethodNamesIndex, testClassMethodName) {
										// All tests must start with "test" and be a function
										if(testClassMethodName.startsWith('test')) {
											//app.log('Test method name:', testClassMethodName);

											var appendTestMethod = false;

											// Filter test methods
											if(matchStringMethodPatternExactly) {
												if(testClassMethodName.lowercase() == methodPattern) {
													appendTestMethod = true;
												}
											}
											else if(methodPattern == null || testClassMethodName.lowercase().match(methodPattern)) {
												//app.log(testClassMethodName.lowercase(), 'matched against', methodPattern);
												appendTestMethod = true;
											}
											else {
												//app.log(testClassMethodName.lowercase(), 'did not match against', methodPattern);
											}

											if(appendTestMethod) {
												tests.methods.append({
													name: testClassMethodName,
													method: instantiatedTestClass[testClassMethodName],
													class: testClassObject,
												});
											}
										}
									});
								}
								else {
									throw new Error(fileSystemObject.file+' did not export a Test class.');
								}
							}
						}
						catch(error) {
							app.log('Caught an error while loading test.', error);
							Node.exit();
						}
					}
					else {
						//app.log(fileSystemObject.path.lowercase(), 'did not match against', filePattern);
					}
				}
			}
		});

		return tests;
	}

}

// Export
export default Proctor;
