// Require Framework and instantiate an empty project
require('./../Framework.js');
Project = new Framework();

// Load and initialize the test module
Module.load('Test');
Module.initialize('Test');

// Create a Proctor to oversee all of the tests as they run
proctor = new Proctor();

// Get and run the test methods
var path = Node.Process.argv[2] ? Node.Process.argv[2] : null;
var testMethodName = Node.Process.argv[3] ? Node.Process.argv[3] : null
proctor.getAndRunTestMethods(path, testMethodName);