// Dependencies
import Settings from './../../system/settings/Settings.js';
//import Terminal from './../../system/console/Terminal.js';
import Version from './../../system/version/Version.js';

// Class
class Command {

	settings = new Settings({
		usage: null,
		supplementalNotes: null,

		//requiredArguments: [],
		//optionalArguments: [],

		options: [
			/* 
			An option looks like:
			{ 
				identifier: 'path',
				type: 'string', 
				defaultValue: null,
				description: 'The path.',
				aliases: [
					'p',
				],
				identifiers: [ // An array with the identifier and the aliases
				],
			},
			*/
		],
	});

	usage = null;
	supplementalNotes = null;

	command = null;
	file = null;
	arguments = null;
	options = null;

	constructor(argumentsArray, settings) {
		this.settings.merge(settings);

		// Set the usage and supplemental notes
		this.usage = this.settings.get('usage');
		this.supplementalNotes = this.settings.get('supplementalNotes');

		// Create an identifiers field on all options
		var optionsSettings = this.settings.get('options');
		optionsSettings.each(function(index, optionSettings) {
			// Create a flat array of option identifiers
			optionSettings.identifiers = [optionSettings.identifier].merge(optionSettings.aliases);
		});
		this.settings.set('options', optionsSettings);
		//Node.exit(this);

		// Parse the arguments array
		this.parse(argumentsArray);

		//Node.exit(this);
	}

	parse(argumentsArray) {
		//Node.exit('parse', argumentsArray);

		// Make sure we are working with an array
		if(String.is(argumentsArray)) {
			argumentsArray = argumentsArray.split(' ');
		}
		//Node.exit('parse', argumentsArray);

		this.command = argumentsArray[0];
		this.file = argumentsArray[1];
		this.arguments = {};
		this.options = {};

		var argumentsToProcess = argumentsArray.slice(2);
		//Node.exit('parse', 'argumentsToProcess', argumentsToProcess);

		// Loop over the options settings
		this.settings.get('options').each(function(index, optionSettings) {
			// Set the option value
			this.options[optionSettings.identifier] = this.getOptionValue(optionSettings, argumentsToProcess);
		}.bind(this));

		// Version
		if(Command.versionOptions.contains(this.argumentToOptionIdentifier(argumentsToProcess.first()))) {
			this.showVersion();
		}
		// Help
		else if(Command.helpOptions.contains(this.argumentToOptionIdentifier(argumentsToProcess.first()))) {
			this.showHelp();
		}

		// Show command options
		argumentsArray.each(function(argumentIndex, argumentValue) {
			if(this.argumentToOptionIdentifier(argumentValue) == 'showCommandOptions') {
				this.showCommandOptions();
				return false; // break
			}
		}.bind(this));

		//Node.exit(this);

		return this;
	}

	showVersion() {
		Console.writeLine(Project.title+' '+(Project.version ? Project.version : '(unknown version)'));

		Node.exit();
	}

	showHelp() {
		//Node.exit(this);

		Console.writeLine(Project.title+' '+(Project.version ? Project.version : '(unknown version)'));
		Console.writeLine();

		if(this.usage) {
			Console.writeLine('Usage:');
			Console.writeLine('  '+this.usage.replace("\n", "\n  "));
			Console.writeLine();
		}

		if(Project.description) {
			Console.writeLine(Project.description);
			Console.writeLine();
		}
		
		var optionsSettings = this.settings.get('options');
		if(optionsSettings.length) {
			Console.writeLine('Options:');
			optionsSettings.each(function(optionSettingsIndex, optionSettings) {
				var optionLine = '  --'+optionSettings.identifier;
				if(optionSettings.aliases.length) {
					optionLine += ' (-'+optionSettings.aliases.join(', -')+')';
				}
				optionLine += Terminal.style(' (default: '+optionSettings.defaultValue+')', 'gray');
				Console.writeLine(optionLine);

				if(optionSettings.description) {
					Console.writeLine('    '+optionSettings.description);
					Console.writeLine();
				}
			});
		}

		if(!optionsSettings.length) {
			Console.writeLine();
		}

		if(this.supplementalNotes) {
			Console.writeLine(this.supplementalNotes);
		}

		Node.exit();
	}

	showCommandOptions() {
		Console.writeLine('Command Options:');

		var optionsSettings = this.settings.get('options');
		optionsSettings.each(function(optionSettingsIndex, optionSettings) {
			Console.writeLine('  '+optionSettings.identifier+': '+Terminal.style(this.options[optionSettings.identifier], 'cyan'));
		}.bind(this));

		Console.writeLine();
	}

	getOptionValue(optionSettings, argumentsArray) {
		//Node.exit(argumentsArray);

		var optionValue = optionSettings.defaultValue;
		
		for(var i = 0; i < argumentsArray.length; i++) {
			// Check to see if the current argument matches the current option
			if(optionSettings.identifiers.contains(this.argumentToOptionIdentifier(argumentsArray[i]))) {
				//app.info('optionSettings.identifier', optionSettings.identifier, 'matches', '"'+this.argumentToOptionIdentifier(argumentsArray[i])+'"');
				//app.log('current argument', argumentsArray[i]);
				//app.log('next argument', argumentsArray[i + 1]);

				var currentArgumentOptionSettingsFromOptionIdentifier = this.getOptionSettingsFromOptionIdentifier(argumentsArray[i]);
				//app.log('currentArgumentOptionSettingsFromOptionIdentifier', currentArgumentOptionSettingsFromOptionIdentifier);
				var nextArgumentOptionSettingsFromNextOptionIdentifier = this.getOptionSettingsFromOptionIdentifier(argumentsArray[i + 1]);
				//app.log('nextArgumentOptionSettingsFromNextOptionIdentifier', nextArgumentOptionSettingsFromNextOptionIdentifier);
				var nextArgumentExists = (argumentsArray[i + 1] !== undefined);

				// If the current argument is an option
				if(currentArgumentOptionSettingsFromOptionIdentifier) {
					// Options of type boolean are set to true if the option is present and receives no argument
					if(
						// If the current option is of type boolean
						(currentArgumentOptionSettingsFromOptionIdentifier.type == 'boolean')
						&&
						// And if there is no next argument or the next argument is an option
						(!nextArgumentExists || nextArgumentOptionSettingsFromNextOptionIdentifier)
					) {
						optionValue = true;
						break;
					}
					// If the next argument exists and is not an option, set it as the option value
					else if(nextArgumentExists && !nextArgumentOptionSettingsFromNextOptionIdentifier) {
						// This is a very naive approach and is not robust at all
						optionValue = this.getOptionValueFromArgumentUsingOptionSettings(optionSettings, argumentsArray[i + 1]);
						break; // Exit the for loop
					}
				}
			}
		}

		return optionValue;
	}

	argumentToOptionIdentifier(argument) {
		var optionIdentifier = null;

		if(argument && String.is(argument)) {
			optionIdentifier = argument.replace('-', '');
		}

		return optionIdentifier;
	}

	getOptionValueFromArgumentUsingOptionSettings(optionSettings, argument) {
		var optionValue = argument;

		// Handle booleans (turn true/false strings into actual booleans)
		if(optionSettings.type == 'boolean') {
			if(optionValue == 'false') {
				optionValue = false;
			}
			else if(optionValue) {
				optionValue = true;
			}
		}

		return optionValue;
	}

	getOptionSettingsFromOptionIdentifier(optionIdentifier) {
		//app.info('getOptionSettingsFromOptionIdentifier', 'optionIdentifier', optionIdentifier);

		if(optionIdentifier === undefined) {
			return null;
		}

		// Strip all dashes from the optionIdentifier
		optionIdentifier = optionIdentifier.replace('-', '');

		var optionSettingsFromOptionIdentifier = null;

		this.settings.get('options').each(function(index, optionSettings) {
			if(optionSettings.identifiers.contains(optionIdentifier)) {
				optionSettingsFromOptionIdentifier = optionSettings;
				return false; // break
			}
		});

		//Node.exit();

		return optionSettingsFromOptionIdentifier;
	}

	static versionOptions = [
		'v',
		'version',
	];

	static helpOptions = [
		'?',
		'h',
		'help',
	];

}

// Export
export default Command;
