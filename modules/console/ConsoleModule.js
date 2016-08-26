// Dependencies
import Module from './../../system/module/Module.js';
import Version from './../../system/version/Version.js';
import ConsoleSession from './../../system/console/ConsoleSession.js';

// Class
class ConsoleModule extends Module {

	version = new Version('0.1.0');

	defaultSettings = {
		commandHistory: {
			enabled: true,
			directory: Node.Path.join(app.directory, 'logs'),
			nameWithoutExtension: 'console-command-history',
		},
		log: {
			enabled: true,
			directory: Node.Path.join(app.directory, 'logs'),
			nameWithoutExtension: 'console',
		},
	};

	consoleSession = null;

	async initialize(settings) {
		await super.initialize(...arguments);

		//// Create a ConsoleSession to manage logging and interaction with the console
		//Console.session = this.consoleSession = new ConsoleSession();

		//// Attach a log to the console if enabled
		//if(this.settings.get('log.enabled')) {
		//	Console.session.attachLog(this.settings.get('log.directory'), this.settings.get('log.nameWithoutExtension'));
		//}

		//// Load command history if enabled
		//if(this.settings.get('commandHistory.enabled')) {
		//	Console.session.loadCommandHistory(this.settings.get('commandHistory.directory'), this.settings.get('commandHistory.nameWithoutExtension'));
		//}
	}
	
}

// Export
export default ConsoleModule;
