// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { Command } from '@framework/system/interface/command-line/Command.js';

// Class
class CommandTest extends Test {

	async testCommand() {
		var commandSettings = app.settings.get('interfaces.commandLine.command');

		var commandString = 'node app proctor -r dot -b -f command -m method';

		var actual = new Command(commandSettings, commandString);
		await actual.initialize();
		//console.info(actual);

		Assert.strictEqual(actual.subcommands.proctor.options.path, null, 'proctor command path option is set correctly');
		Assert.strictEqual(actual.subcommands.proctor.options.filePattern, 'command', 'proctor command filePattern option is set correctly');
		Assert.strictEqual(actual.subcommands.proctor.options.methodPattern, 'method', 'proctor command methodPattern option is set correctly');
		Assert.strictEqual(actual.subcommands.proctor.options.reporter, 'dot', 'proctor command reporter option is set correctly');
		Assert.strictEqual(actual.subcommands.proctor.options.supervise, false, 'proctor command supervise option is set correctly');
		Assert.strictEqual(actual.subcommands.proctor.options.breakOnError, true, 'proctor command breakOnError option is set correctly');

		// TODO: test showing help for a specific command, e.g., node app proctor --help

		// TODOL Another test with sub sub commands
		//commandString = '-option1 option1Argument1 --option2 subCommand1 -subCommandOption1 subCommandOption1Argument --subCommandOption2 subSubCommand1';		
	}

}

// Export
export { CommandTest };
