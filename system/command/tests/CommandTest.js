// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';
import Command from './../../../system/command/Command.js';

// Class
class CommandTest extends Test {

	async testCommand() {
		var commandSettings = {
			usage: 'node app/Framework.js',
			description: 'Visit https://www.system.org/framework to learn more about Framework.',
			subcommands: {
				graphicalInterface: {
					usage: 'node app graphicalInterface',
					description: 'Display the Framework graphical interface powered by Electron.',
					aliases: [
						'gi',
					],
				},
				proctor: {
					usage: 'node app proctor',
					description: 'Run and benchmark tests.',
					aliases: [
						'test',
					],
					options: {
						path: {
							type: 'string',
							defaultValue: null,
							description: 'The path containing tests to run.',
							aliases: [
								'p',
							],
						},
						filePattern: {
							type: 'string',
							defaultValue: null,
							description: 'A pattern used to filter which test files will be run.',
							aliases: [
								'f',
							],
						},
						methodPattern: {
							type: 'string',
							defaultValue: null,
							description: 'A pattern used to filter which test class methods will be run.',
							aliases: [
								'm',
							],
						},
						reporter: {
							type: 'string',
							defaultValue: 'standard',
							description: 'The test reporter to use. Currently, "standard", "dot", and "concise" are available.',
							aliases: [
								'r',
							],
						},
						supervise: {
							type: 'boolean',
							defaultValue: false,
							description: 'Watch for changes and run tests when changes happen. Either "true" or "false".',
							aliases: [
								's',
							],
						},
						breakOnError: {
							type: 'boolean',
							defaultValue: false,
							description: 'Stop running tests on the first error encountered. Either "true" or "false".',
							aliases: [
								'b',
								'break',
							],
						},
					},
				},
			},
		};

		var commandString = 'nodeExecutableFile javaScriptFile proctor -r dot -b -f command -m method';

		var actual = new Command(commandSettings, commandString);
		//app.info(actual);

		// Do assertions

		// test showing help for a specific command, e.g., node app/Framework.js proctor --help

		// Another test
		//commandString = '-option1 option1Argument1 --option2 subCommand1 -subCommandOption1 subCommandOption1Argument --subCommandOption2';		
	}

}

// Export
export default CommandTest;
