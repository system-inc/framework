// Dependencies
import Terminal from './../../system/interface/Terminal.js';

// Class
class Command {

	file = null;
	command = null;
	arguments = null;

	usage = null;
	supplementalNotes = null;
	
	options = [];
	commands = [];

	constructor(argumentsArray, options = {}) {
		// Set the usage and supplemental notes
		this.usage = options.getValueForKey('usage');
		this.supplementalNotes = options.getValueForKey('supplementalNotes');

		// Create an identifiers field on all options
		//var optionsSettings = this.settings.get('options');
		//optionsSettings.each(function(index, optionSettings) {
		//	// Create a flat array of option identifiers
		//	optionSettings.identifiers = [optionSettings.identifier].merge(optionSettings.aliases);
		//});
		//this.settings.set('options', optionsSettings);
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
		//this.settings.get('options').each(function(index, optionSettings) {
		//	// Set the option value
		//	this.options[optionSettings.identifier] = this.getOptionValue(optionSettings, argumentsToProcess);
		//}.bind(this));

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
		app.standardStreams.output.writeLine(app.title+' '+(app.version ? app.version : '(unknown version)'));

		Node.exit();
	}

	showHelp() {
		//Node.exit(this);

		app.standardStreams.output.writeLine(app.title+' '+(app.version ? app.version : '(unknown version)'));
		app.standardStreams.output.writeLine();

		if(this.usage) {
			app.standardStreams.output.writeLine('Usage:');
			app.standardStreams.output.writeLine('  '+this.usage.replace("\n", "\n  "));
			app.standardStreams.output.writeLine();
		}

		if(app.description) {
			app.standardStreams.output.writeLine(app.description);
			app.standardStreams.output.writeLine();
		}
		
		var optionsSettings = this.settings.get('options');
		if(optionsSettings.length) {
			app.standardStreams.output.writeLine('Options:');
			optionsSettings.each(function(optionSettingsIndex, optionSettings) {
				var optionLine = '  --'+optionSettings.identifier;
				if(optionSettings.aliases.length) {
					optionLine += ' (-'+optionSettings.aliases.join(', -')+')';
				}
				optionLine += Terminal.style(' (default: '+optionSettings.defaultValue+')', 'gray');
				app.standardStreams.output.writeLine(optionLine);

				if(optionSettings.description) {
					app.standardStreams.output.writeLine('    '+optionSettings.description);
					app.standardStreams.output.writeLine();
				}
			});
		}

		if(!optionsSettings.length) {
			app.standardStreams.output.writeLine();
		}

		if(this.supplementalNotes) {
			app.standardStreams.output.writeLine(this.supplementalNotes);
		}

		Node.exit();
	}

	showCommandOptions() {
		app.standardStreams.output.writeLine('Command Options:');

		var optionsSettings = this.settings.get('options');
		optionsSettings.each(function(optionSettingsIndex, optionSettings) {
			app.standardStreams.output.writeLine('  '+optionSettings.identifier+': '+Terminal.style(this.options[optionSettings.identifier], 'cyan'));
		}.bind(this));

		app.standardStreams.output.writeLine();
	}

	getOptionValue(optionSettings, argumentsArray) {
		//Node.exit(argumentsArray);

		var optionValue = optionSettings.defaultValue;
		
		for(var i = 0; i < argumentsArray.length; i++) {
			// Check to see if the current argument matches the current option
			if(optionSettings.identifiers.contains(this.argumentToOptionIdentifier(argumentsArray[i]))) {
				//app.info('optionSettings.identifier', optionSettings.identifier, 'matches', '"'+this.argumentToOptionIdentifier(argumentsArray[i])+'"');
				//app.standardStreams.output.writeLine('current argument', argumentsArray[i]);
				//app.standardStreams.output.writeLine('next argument', argumentsArray[i + 1]);

				var currentArgumentOptionSettingsFromOptionIdentifier = this.getOptionSettingsFromOptionIdentifier(argumentsArray[i]);
				//app.standardStreams.output.writeLine('currentArgumentOptionSettingsFromOptionIdentifier', currentArgumentOptionSettingsFromOptionIdentifier);
				var nextArgumentOptionSettingsFromNextOptionIdentifier = this.getOptionSettingsFromOptionIdentifier(argumentsArray[i + 1]);
				//app.standardStreams.output.writeLine('nextArgumentOptionSettingsFromNextOptionIdentifier', nextArgumentOptionSettingsFromNextOptionIdentifier);
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

		if(!optionIdentifier) {
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
