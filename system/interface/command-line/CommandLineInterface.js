// Dependencies
import { Interface } from '@framework/system/interface/Interface.js';
import { Settings } from '@framework/system/settings/Settings.js';
import { Command } from '@framework/system/interface/command-line/Command.js';

// Class
class CommandLineInterface extends Interface {

	settings = new Settings();
	command = null;

	constructor(settings) {
		super();
		this.settings.merge(settings);

		this.createCommand();
	}

	createCommand(processArguments = null) {
		var commandSettings = this.settings.get('command');

		if(!processArguments) {
			processArguments = Node.Process.argv;
		}

		this.command = new Command(commandSettings, processArguments);
	}

}

// Export
export { CommandLineInterface };
