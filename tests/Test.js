// Usage
// "Test.js" - find all of the Tests in the tests folder and run them all
// "Test.js" types" - run all of the tests in tests/types
// "Test.js" types/ArrayTest" - run all of the tests for ArrayTest
// "Test.js" types/ArrayTest testContains" - run the testContains test in ArrayTest

// Framework
require('./../Framework.js');
Project = new Framework();

// Initialize the test module
Module.load('Test');
Module.initialize('Test');

// Create a Proctor to oversee all of the tests as they run
new Proctor();