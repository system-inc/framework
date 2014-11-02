// Require Framework
require('./../Framework.js');

// Initialize the test module
Module.load('Test');
Module.initialize('Test');

var passes = 0;
var failures = 0;
var path = (Node.Process.argv[2] ? Node.Process.argv[2] : null);

// Find the test they want to run
require('./../tests/framework/types/ArrayTest');





// Start the stopwatch
var stopwatch = new Stopwatch();

var test = new ArrayTest();

try {
	test.testEquality();
	passes++;
}
catch(error) {
	failures++;
}

// Stop the stopwatch
stopwatch.stop();

// Notify the user of how many tests passed and failed
Console.out(passes+' passed, '+failures+' failed ('+Number.round(stopwatch.elapsedTime)+' '+stopwatch.time.precision+')');

// Exit the process
Node.Process.exit();