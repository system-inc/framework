// Require Framework and instantiate an empty project
require('./../Framework.js');
Project = new Framework();

// Parse the command-line arguments
var parsedArguments = Arguments.parse(Node.Process.argv, {
	usage: '[options path testMethodName]',
	requiredArguments: [
		{
			identifier: 'path'
		}
	],
	optionalArguments: [
		{
			identifier: 'testMethodName',
		}
	],
	options: [
		{
			option: 'reporter',
			description: 'Specifiy a test reporter to use. Currently, "standard" and "dot" are available, with "standard" being the default.',
			aliases: [
				'r',
			],
			requiredArguments: [
			],
			optionalArguments: [
			],
		},
	],
});
//Console.out(parsedArguments);

// Load and initialize the test module
Module.load('Test');
Module.initialize('Test');

// Create a Proctor to oversee all of the tests as they run
proctor = new Proctor(parsedArguments.options.reporter);

// Get and run the tests
proctor.getAndRunTests(parsedArguments.arguments.path, parsedArguments.arguments.testMethodName);