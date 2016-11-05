// Dependencies
import Interface from 'system/interface/Interface.js';
import Settings from 'system/settings/Settings.js';
import Command from 'system/interface/command-line/Command.js';

// Class
class CommandLineInterface extends Interface {

	settings = new Settings();
	command = null;

	constructor(settings) {
		super();
		this.settings.merge(settings);

		this.initializeCommand();
	}

	initializeCommand() {
		var commandSettings = this.settings.get('command');
		this.command = new Command(commandSettings, Node.Process.argv);
	}

}

// Export
export default CommandLineInterface;
