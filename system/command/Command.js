// Dependencies
import Terminal from './../../system/interface/Terminal.js';
import Settings from './../../system/settings/Settings.js';

// Class
class Command {

	// The configuration for the command
	settings = new Settings({
		usage: null,
		description: null,
		options: {
			version: {
				type: 'boolean',
				defaultValue: false,
				description: 'Show the version of the app.',
				aliases: [
					'v',
				],
			},
			help: {
				type: 'boolean',
				defaultValue: false,
				description: 'Show help.',
				aliases: [
					'h',
					'?',
				],
			},
			debugCommand: {
				type: 'boolean',
				defaultValue: false,
				description: 'Show the command configuration.',
				aliases: [
					'dc',
				],
			},
		},
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
			this.reformOptionSettings(option, optionKey);
			
			// Set default values for the options for the root command
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
		//app.log(optionSettings, optionSettingsKey);
		optionSettings.identifier = optionSettingsKey;

		if(!optionSettings.aliases) {
			optionSettings.aliases = [];
		}
		optionSettings.aliases.prepend(optionSettingsKey);
	}

	setDefaultValuesForCommandOptions(optionsSettings, optionsNode) {
		optionsSettings.each(function(optionIdentifier, optionSettings) {
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
				//app.log('currentArgument', currentArgument);

				var possibleSubcommandSettings = currentCommandSettings.subcommands[currentArgument];

				// If the current argument is a subcommand
				if(possibleSubcommandSettings) {
					// Set the subcommand
					this.subcommands[possibleSubcommandSettings.identifier] = {
						options: {},
					};

					// Set the defaults for the subcommand options
					this.setDefaultValuesForCommandOptions(possibleSubcommandSettings.options, this.subcommands[possibleSubcommandSettings.identifier].options);

					// Read in the options for the current subcommand
					currentArgumentIndex = this.parseOptions(possibleSubcommandSettings.options, this.subcommands[possibleSubcommandSettings.identifier].options, currentArgumentIndex + 1, argumentsToProcess);
				}
				// If the current argument is not a subcommand
				else {
					// Read in the options
					currentArgumentIndex = this.parseOptions(currentCommandSettings.options, this.options, currentArgumentIndex, argumentsToProcess);
				}
			}

			//app.info('command', this);

			// Version
			if(this.options.version) {
				this.showVersion();
			}
			// Help
			else if(this.options.help) {
				this.showHelp();
			}
			// Debug command
			else if(this.options.debugCommand) {
				this.showDebugCommand();
			}
		}

		return this;
	}

	parseOptions(optionsSettings, optionsNode, currentArgumentIndex, argumentsToProcess) {
		// Get the current argument
		var currentArgument = argumentsToProcess[currentArgumentIndex];
		//app.log('currentArgument', currentArgument);

		// Check to see if the current argument is an option alias
		var optionIdentifier = this.optionAliasToOptionIdentifier(currentArgument, optionsSettings);
		//app.log('optionIdentifier', optionIdentifier);

		// If the current argument is an option alias
		if(optionIdentifier) {
			var currentArgumentOptionSettings = optionsSettings[optionIdentifier];
			//app.log('currentArgumentOptionSettings', currentArgumentOptionSettings);

			// Move to the next argument
			currentArgumentIndex++;
			
			// If the next argument exists
			if(currentArgumentIndex < argumentsToProcess.length) {
				// Get the next argument
				var nextArgument = argumentsToProcess[currentArgumentIndex];

				// If the next argument is an option alias
				if(this.optionAliasToOptionIdentifier(nextArgument, optionsSettings)) {
					// Option aliases provided without values have the value set to true
					if(currentArgumentOptionSettings.type == 'boolean') {
						//app.log('bool!', currentArgumentOptionSettings);
						optionsNode[optionIdentifier] = true;
					}

					// Move to the next argument
					currentArgumentIndex = this.parseOptions(optionsSettings, optionsNode, currentArgumentIndex, argumentsToProcess);
				}
				// If the next argument is a subcommand or subsubcommand
				else if(this.argumentIsSubcommandAlias(nextArgument)) {
					// Do nothing
				}
				// If the argument is not an option alias or a subcommand, the argument must be the value for the option
				else {
					//app.log('nextArgument', nextArgument, 'is option value');
					optionsNode[optionIdentifier] = nextArgument;

					// Move to the next next argument if it exists
					var nextNextArgumentIndex = currentArgumentIndex + 1;
					if(nextNextArgumentIndex < argumentsToProcess.length) {
						currentArgumentIndex = this.parseOptions(optionsSettings, optionsNode, nextNextArgumentIndex, argumentsToProcess);	
					}
				}
			}
			// The next argument does not exist
			else {
				// Option aliases provided without values have the value set to true
				if(currentArgumentOptionSettings.type == 'boolean') {
					optionsNode[optionIdentifier] = true;
				}
			}
		}

		return currentArgumentIndex;
	}

	argumentIsSubcommandAlias(argument) {
		var argumentIsSubcommandAlias = false;

		return argumentIsSubcommandAlias;
	}

	optionAliasToOptionIdentifier(argument, optionsSettings) {
		var optionAliasToOptionIdentifier = false;
		
		// All option identifiers start with a hyphen
		if(this.argumentIsPossibleOptionAlias(argument)) {
			// Get rid of all hyphens to get a possible alias
			var possibleOptionAlias = argument.replace('-', '');

			// Run through all of the option aliases to see if we have a match
			optionsSettings.each(function(optionKey, optionSettings) {
				if(optionSettings.aliases.contains(possibleOptionAlias)) {
					//app.log('possibleOptionAlias', possibleOptionAlias, 'is an option alias for', optionKey);
					optionAliasToOptionIdentifier = optionKey;
					return false; // break
				}
			});
		}

		return optionAliasToOptionIdentifier;
	}

	argumentIsPossibleOptionAlias(argument) {
		var argumentIsPossibleOptionAlias = false;

		if(argument && argument.startsWith('-')) {
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

		if(app.description) {
			app.standardStreams.output.writeLine(app.description);
			app.standardStreams.output.writeLine();
		}

		var usage = this.settings.get('usage');
		if(usage) {
			app.standardStreams.output.writeLine('Usage:');
			app.standardStreams.output.writeLine('  '+usage.replace("\n", "\n  "));
			app.standardStreams.output.writeLine();
		}
		
		var optionsSettings = this.settings.get('options');
		if(Object.keys(optionsSettings).length) {
			app.standardStreams.output.writeLine('Options:');
			optionsSettings.each(function(optionSettingsIndex, optionSettings) {
				var optionLine = '  --'+optionSettings.identifier;
				if(optionSettings.aliases.length > 1) {
					optionLine += ' (-'+optionSettings.aliases.slice(1).join(', -')+')';
				}
				optionLine += Terminal.style(' (default: '+optionSettings.defaultValue+')', 'gray');
				app.standardStreams.output.writeLine(optionLine);

				if(optionSettings.description) {
					app.standardStreams.output.writeLine('    '+optionSettings.description);
					app.standardStreams.output.writeLine();
				}
			});
		}
		else {
			app.standardStreams.output.writeLine();
		}

		var description = this.settings.get('description');
		if(description) {
			app.standardStreams.output.writeLine('Description:');
			app.standardStreams.output.writeLine('  '+description.replace("\n", "\n  "));
			app.standardStreams.output.writeLine();
		}

		Node.exit();
	}

	showDebugCommand() {
		app.standardStreams.output.writeLine('Options:');
		app.standardStreams.output.writeLine(Json.indent(this.options));
		app.standardStreams.output.writeLine('Subcommands:');
		app.standardStreams.output.writeLine(Json.indent(this.subcommands));
	}

}

// Export
export default Command;
