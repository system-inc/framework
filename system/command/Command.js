// Dependencies
import Terminal from './../../system/interface/Terminal.js';
import Settings from './../../system/settings/Settings.js';

// Class
class Command {

	// The configuration for the command
	settings = new Settings({
		usage: null,
		description: null,
		options: {},
		subcommands: {},
	});

	// The JavaScript file Node is executing
	file = null;

	// The Node executable file
	command = null;

	// The options and commands are populated when we parse the string arguments array
	options = {};
	subcommands = {};

	constructor(settings, argumentsArray) {
		this.settings.merge(settings);

		// We will loop through all of the settings and reform them as well as set the default values for the options for the root command
		var settings = this.settings.get();

		// Loop through all of the options
		settings.options.each(function(optionKey, option) {
			// Reform the options settings
			this.reformOptionSettings(optionKey, option);
			
			// Set default values for the options for the root command
			this.options[optionKey] = null;
			this.setDefaultValueForOption(option, this.options, optionKey);
		}.bind(this));

		// Loop through all of the commands
		settings.subcommands.each(function(subcommandKey, subcommand) {
			// Reform the subcommand settings
			this.reformSubcommandSettings(subcommand, subcommandKey);
		}.bind(this));

		// Parse the arguments array
		this.parse(argumentsArray);
	}

	reformOptionSettings(optionSettings, optionSettingsKey) {
		optionSettings.identifier = optionSettingsKey;

		if(!optionSettings.aliases) {
			optionSettings.aliases = [];
		}
		optionSettings.aliases.prepend(optionSettingsKey);
	}

	setDefaultValuesForCommandOptions(optionsSettings, optionsNode) {
		optionsSettings.each(function(optionIdentifier, optionSettings) {
			optionsNode[optionIdentifier] = null;
			this.setDefaultValueForOption(optionSettings, optionsNode, optionIdentifier);
		}.bind(this));
	}

	setDefaultValueForOption(optionSettings, optionsNode, optionKey) {
		var defaultValue = null;

		if(optionSettings.defaultValue !== undefined) {
			defaultValue = optionSettings.defaultValue;
		}

		optionsNode[optionKey] = defaultValue;
	}

	reformSubcommandSettings(subcommandSettings, subcommandSettingsKey) {
		subcommandSettings.identifier = subcommandSettingsKey;

		if(!subcommandSettings.subcommands) {
			subcommandSettings.subcommands = {};
		}
		subcommandSettings.subcommands.each(function(subSubcommandSettingsKey, subSubcommandSettings) {
			this.reformSubcommandSettings(subSubcommandSettings, subSubcommandSettingsKey);
		}.bind(this));

		if(!subcommandSettings.options) {
			subcommandSettings.options = {};
		}
		subcommandSettings.options.each(function(optionKey, option) {
			this.reformOptionSettings(option, optionKey);
		}.bind(this));

		if(!subcommandSettings.aliases) {
			subcommandSettings.aliases = [];
		}
		subcommandSettings.aliases.prepend(subcommandSettingsKey);
	}

	parse(argumentsArray) {
		// Make sure we are working with an array
		if(String.is(argumentsArray)) {
			argumentsArray = argumentsArray.split(' ');
		}

		// If we have an arguments array
		if(Array.is(argumentsArray)) {
			//app.info('argumentsArray', argumentsArray);

			// The JavaScript file Node is executing
			this.file = argumentsArray[1];

			// The Node executable file
			this.command = argumentsArray[0];

			// The rest of the command arguments
			var argumentsToProcess = argumentsArray.slice(2);

			var currentCommandSettings = this.settings.get();

			// Loop through the arguments to process
			for(var currentArgumentIndex = 0; currentArgumentIndex < argumentsToProcess.length; currentArgumentIndex++) {
				var currentArgument = argumentsToProcess[currentArgumentIndex];

				// Check if the current argument is a subcommand
				var possibleSubcommandSettings = currentCommandSettings.subcommands[currentArgument];
				if(possibleSubcommandSettings) {
					// Set the subcommand
					this.subcommands[possibleSubcommandSettings.identifier] = {
						options: {},
					};

					// Set the defaults for the subcommand options
					this.setDefaultValuesForCommandOptions(possibleSubcommandSettings.options, this.subcommands[possibleSubcommandSettings.identifier].options);

					// Read in the options for the current subcommand
					currentArgumentIndex = this.parseSubcommandOptions(possibleSubcommandSettings.options, this.subcommands[possibleSubcommandSettings.identifier].options, currentArgumentIndex + 1, argumentsToProcess);

					// Move on to the next iteration of the loop
					continue;
				}
			}

			app.info('command', this);
			//throw Error('got this far, need to finish');
			

			//// Version
			//if(Command.versionOptions.contains(this.argumentToOptionIdentifier(argumentsToProcess.first()))) {
			//	this.showVersion();
			//}
			//// Help
			//else if(Command.helpOptions.contains(this.argumentToOptionIdentifier(argumentsToProcess.first()))) {
			//	this.showHelp();
			//}

			//// Show command options
			//argumentsArray.each(function(argumentIndex, argumentValue) {
			//	if(this.argumentToOptionIdentifier(argumentValue) == 'showCommandOptions') {
			//		this.showCommandOptions();
			//		return false; // break
			//	}
			//}.bind(this));
		}

		return this;
	}

	parseSubcommandOptions(subcommandOptionsSettings, optionsNode, currentArgumentIndex, argumentsToProcess) {
		// Get the current argument
		var currentArgument = argumentsToProcess[currentArgumentIndex];

		// If the current argument is an option identifier
		if(this.argumentIsOptionAlias(currentArgument, subcommandOptionsSettings)) {

			// Move to the next argument
			currentArgumentIndex++;
			var nextArgument = argumentsToProcess[currentArgumentIndex];

			// If the next argument does not exist
			// If the next argument is an option alias
			if(this.argumentIsOptionAlias(nextArgument, subcommandOptionsSettings)) {

			}
			// If the next argument is a subcommand or subsubcommand
			//else if() {

			//}
			// If the next argument is the value for the option
			//else if() {

			//}

			// 
			//for(currentArgumentIndex; currentArgumentIndex < argumentsToProcess.length; currentArgumentIndex++) {
			//	currentArgument = argumentsToProcess[currentArgumentIndex];
			//	app.log('currentArgument', currentArgument);
			//}
		}

		return currentArgumentIndex;
	}

	argumentIsOptionAlias(argument, optionsSettings) {
		var argumentIsOptionAlias = false;
		
		// All option identifiers start with a hyphen
		if(this.argumentIsPossibleOptionAlias(argument)) {
			// Get rid of all hyphens to get a possible alias
			var possibleOptionAlias = argument.replace('-', '');

			// Run through all of the option aliases to see if we have a match
			optionsSettings.each(function(optionKey, optionSettings) {
				if(optionSettings.aliases.contains(possibleOptionAlias)) {
					app.log('possibleOptionAlias', possibleOptionAlias, 'is an option alias for', optionKey);
					argumentIsOptionAlias = true;
					return false; // break
				}
			});
		}

		return argumentIsOptionAlias;
	}

	argumentIsPossibleOptionAlias(argument) {
		var argumentIsPossibleOptionAlias = false;

		if(argument.startsWith('-')) {
			argumentIsPossibleOptionAlias = true;
		}

		return argumentIsPossibleOptionAlias;
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

		if(this.description) {
			app.standardStreams.output.writeLine(this.description);
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
