// Dependencies
import { Settings } from '@framework/system/settings/Settings.js';

// Class
class Command {

	// The configuration for the command
	settings = new Settings({
		description: null,
		options: {},
		subcommands: {},
	});

	// Command arguments
	arguments = null;

	// The executable (node, electron, etc.)
	executable = null;

	// The script (a .js file)
	script = null;

	// The options and commands are populated when we parse the string arguments array
	options = {};
	subcommands = {};

	constructor(settings, argumentsArray = []) {
		this.settings.merge(settings);

		// Make sure we are working with an array
		if(String.is(argumentsArray)) {
			argumentsArray = argumentsArray.split(' ');
		}
		this.arguments = argumentsArray;

		// After construction you need to manually call .initialize() in order to finish construction
	}

	async initialize() {
		// We will loop through all of the settings and reform them as well as set the default values for the options for the root command
			// Loop through all of the options
		this.settings.get('options').each(function(optionKey, option) {
			// Reform the options settings
			this.reformOptionSettings(option, optionKey);
			
			// Set default values for the options for the root command
			this.setDefaultValueForOption(option, this.options, optionKey);
		}.bind(this));

		// Initialize the subcommands
		this.initializeSubcommands();

		// Parse the command, will cause the app to exit if the command is malformed
		await this.parse();
	}

	initializeSubcommands() {
		// Loop through all of the subcommands
		this.settings.get('subcommands').each(function(subcommandKey, subcommand) {
			// Reform the subcommand settings
			this.reformSubcommandSettings(subcommand, subcommandKey);
		}.bind(this));
	}

	addSubcommands(subcommandsSettings) {
		//app.log('command settings', this.settings);

		// Merge in the new subcommand
		this.settings.merge({
			subcommands: subcommandsSettings,
		});
		//app.log('command settings', this.settings);

		// Reinitialize the subcommands
		this.initializeSubcommands();
		//app.log(this);
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

	async parse(argumentsArray = null) {
		// Use saved arguments from Command construction if no manual arguments are passed
		if(argumentsArray == null) {
			argumentsArray = this.arguments;
		}

		// Make sure we are working with an array
		if(String.is(argumentsArray)) {
			argumentsArray = argumentsArray.split(' ');
		}

		//app.info('argumentsArray', argumentsArray);

		// The JavaScript file Node is executing
		this.executable = argumentsArray[0];

		// If the executable isn't node, strip out any switches (for example, when running Electron a ton of switches are added)
		if(!this.executable.endsWith('node')) {
			//console.log('does not end with node');

			let currentArgument = argumentsArray.get(1);
			while(currentArgument && currentArgument.startsWith('--')) {
				argumentsArray.delete(1);
				currentArgument = argumentsArray.get(1);
			}
			//app.info('updated argumentsArray', argumentsArray);
		}

		// The rest of the command arguments
		var argumentsToProcess = argumentsArray;

		// If we are in a terminal context, the second argument will be the script we are interpreting and we should start processing at the third argument
		if(app.inTerminalEnvironment()) {
			//console.log('in terminal context');
			this.script = argumentsArray[1];
			argumentsToProcess = argumentsToProcess.slice(2);
		}
		// If we are not in a terminal context (e.g., we are in Electron), then start processing arguments at the second argument
		else {
			//console.log('not in terminal context');
			argumentsToProcess = argumentsToProcess.slice(1);
		}

		//console.info('argumentsToProcess', argumentsToProcess);

		var currentCommandSettings = this.settings.get();

		// Loop through the arguments to process
		for(var currentArgumentIndex = 0; currentArgumentIndex < argumentsToProcess.length; currentArgumentIndex++) {
			var currentArgument = argumentsToProcess[currentArgumentIndex];
			//app.log('currentArgument', currentArgument, 'currentArgumentIndex', currentArgumentIndex);

			var possibleSubcommandIdentifier = this.subcommandAliasToSubcommandIdentifier(currentArgument, currentCommandSettings.subcommands);
			var possibleSubcommandSettings = currentCommandSettings.subcommands[possibleSubcommandIdentifier];
			//app.log('possibleSubcommandSettings', possibleSubcommandSettings);

			// If the current argument is a subcommand
			if(possibleSubcommandSettings) {
				// Set the subcommand
				this.subcommands[possibleSubcommandSettings.identifier] = {
					options: {},
				};

				// Set the defaults for the subcommand options
				this.setDefaultValuesForCommandOptions(possibleSubcommandSettings.options, this.subcommands[possibleSubcommandSettings.identifier].options);

				// Read in the options for the current subcommand
				currentArgumentIndex = await this.parseOptions(possibleSubcommandSettings.options, this.subcommands[possibleSubcommandSettings.identifier].options, currentArgumentIndex + 1, argumentsToProcess);
			}
			// If the current argument is not a subcommand
			else {
				// Read in the options
				currentArgumentIndex = await this.parseOptions(currentCommandSettings.options, this.options, currentArgumentIndex, argumentsToProcess);
			}

			//app.log('currentArgumentIndex', currentArgumentIndex, 'argumentsToProcess.length', argumentsToProcess.length);
		}

		//app.info('command', this);

		// Debug command
		if(this.options.debugCommand) {
			await this.showDebugCommand();
		}

		// Version
		if(this.options.version) {
			await this.showVersion();
			await this.exit();
		}
		// Help
		else if(this.options.help) {
			await this.showHelp();
			await this.exit();
		}

		return this;
	}

	async parseOptions(optionsSettings, optionsNode, currentArgumentIndex, argumentsToProcess) {
		// Get the current argument
		var currentArgument = argumentsToProcess[currentArgumentIndex];
		//app.log('parseOptions currentArgument', currentArgument);

		// Check to see if the current argument is an option alias
		var optionIdentifier = this.optionAliasToOptionIdentifier(currentArgument, optionsSettings);
		//app.log('parseOptions optionIdentifier', optionIdentifier);

		// If the current argument is an option alias
		if(optionIdentifier) {
			var currentArgumentOptionSettings = optionsSettings[optionIdentifier];
			//app.log('currentArgumentOptionSettings', currentArgumentOptionSettings);

			var nextArgumentIndex = currentArgumentIndex + 1;

			// If the next argument exists
			if(nextArgumentIndex < argumentsToProcess.length) {
				// Get the next argument
				var nextArgument = argumentsToProcess[nextArgumentIndex];

				// If the next argument is an option alias
				if(this.optionAliasToOptionIdentifier(nextArgument, optionsSettings)) {
					// Option aliases provided without values have the value set to true
					if(currentArgumentOptionSettings.type == 'boolean') {
						optionsNode[optionIdentifier] = true;
					}

					// Move to the next argument
					currentArgumentIndex = await this.parseOptions(optionsSettings, optionsNode, nextArgumentIndex, argumentsToProcess);
				}
				// If the next argument is a subcommand or subsubcommand
				else if(this.argumentIsSubcommandAlias(nextArgument)) {
					//app.log('next argument "'+nextArgument+'" is a subcommand alias');

					// Option aliases provided without values have the value set to true
					if(currentArgumentOptionSettings.type == 'boolean') {
						optionsNode[optionIdentifier] = true;
					}
				}
				// If the argument is not an option alias or a subcommand, the argument must be the value for the option
				else {
					//app.log('nextArgument', nextArgument, 'is not an option alias for a subcommand alias');

					// Validate option values
					if(
						currentArgumentOptionSettings.type == 'boolean' &&
						(nextArgument != 'true' || nextArgument != 'false')
					) {
						await this.exit(Terminal.style('Invalid value "'+nextArgument+'" for option "'+optionIdentifier+'".', 'red'));
					}
					//app.log('nextArgument', nextArgument, 'is option value');
					optionsNode[optionIdentifier] = nextArgument;

					// Move to the next next argument if it exists
					var nextNextArgumentIndex = nextArgumentIndex + 1;
					if(nextNextArgumentIndex < argumentsToProcess.length) {
						currentArgumentIndex = await this.parseOptions(optionsSettings, optionsNode, nextNextArgumentIndex, argumentsToProcess);
					}
					// If the next next argument doesn't exist, we are finished
					else {
						currentArgumentIndex = nextNextArgumentIndex;
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
		// If the current argument is not an option
		else if(currentArgument !== undefined) {
			var invalidCommandString = 'Invalid command "'+currentArgument+'".';

			var recommendedCommandAliases = this.getRecommendedCommandAliases(currentArgument);
			if(recommendedCommandAliases.length) {
				invalidCommandString += ' Did you mean '+recommendedCommandAliases.toConjunctionString('or', '"')+'?';
			}
			
			await this.exit(Terminal.style(invalidCommandString, 'red'));
		}

		return currentArgumentIndex;
	}

	getRecommendedCommandAliases(suppliedCommand) {
		var subcommandsSettings = this.settings.get('subcommands');

		var recommendedCommandAliases = [];

		subcommandsSettings.each(function(subcommandIdentifier, subcommandSettings) {
			subcommandSettings.aliases.each(function(subcommandAliasIndex, subcommandAlias) {
				//app.log(suppliedCommand, subcommandAlias, String.distance(suppliedCommand, subcommandAlias));
				if(String.distance(suppliedCommand, subcommandAlias) < 5) {
					recommendedCommandAliases.append(subcommandAlias);
				}
			});
		});

		return recommendedCommandAliases;
	}

	argumentIsSubcommandAlias(argument, subcommandsSettings) {
		//app.log('argument', argument);

		if(!subcommandsSettings) {
			subcommandsSettings = this.settings.get('subcommands');
		}

		var argumentIsSubcommandAlias = false;

		subcommandsSettings.each(function(index, subcommandSettings) {
			if(subcommandSettings.aliases.contains(argument)) {
				argumentIsSubcommandAlias = true;
			}
			else {
				argumentIsSubcommandAlias = this.argumentIsSubcommandAlias(argument, subcommandSettings.subcommands);	
			}

			if(argumentIsSubcommandAlias) {
				return false; // break;
			}
		}.bind(this));

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

	subcommandAliasToSubcommandIdentifier(argument, subcommandsSettings) {
		var subcommandAliasToSubcommandIdentifier = false;
		
		// Run through all of the option aliases to see if we have a match
		subcommandsSettings.each(function(subcommandKey, subcommandSettings) {
			if(subcommandSettings.aliases.contains(argument)) {
				//app.log('argument', argument, 'is an option alias for', subcommandKey);
				subcommandAliasToSubcommandIdentifier = subcommandKey;
				return false; // break
			}
		});

		return subcommandAliasToSubcommandIdentifier;
	}

	argumentIsPossibleOptionAlias(argument) {
		var argumentIsPossibleOptionAlias = false;

		if(argument && argument.startsWith('-')) {
			argumentIsPossibleOptionAlias = true;
		}

		return argumentIsPossibleOptionAlias;
	}

	async showVersion() {
		app.standardStreams.output.writeLine(app.title+' '+(app.version ? app.version : '(unknown version)'));
	}

	async showHelp() {
		//this.exit(this);

		var title = app.title+' '+(app.version ? app.version : '(unknown version)');

		var headline = app.settings.get('headline');
		if(headline) {
			title += ' - '+headline;
		}

		app.standardStreams.output.writeLine(Terminal.style(title, 'bold'));
		app.standardStreams.output.writeLine();

		var description = this.settings.get('description');
		if(description) {
			app.standardStreams.output.writeLine(description.replace("\n", "\n  "));
			app.standardStreams.output.writeLine();
		}
		
		function showOptionHelp(optionsSettings, commandIdentifier = '', indentationSpaces = 0) {
			var indentation = ' '.repeat(indentationSpaces);

			if(optionsSettings.getSize()) {
				app.standardStreams.output.writeLine(indentation+Terminal.style(commandIdentifier+'Options', 'underline')+"\n");
				optionsSettings.each(function(optionSettingsIndex, optionSettings) {
					var line = indentation+'--'+optionSettings.identifier;
					if(optionSettings.aliases.length > 1) {
						line += ' (-'+optionSettings.aliases.slice(1).join(', -')+')';
					}
					line += Terminal.style(' (default: '+optionSettings.defaultValue+')', 'gray');
					app.standardStreams.output.writeLine(line);

					if(optionSettings.description) {
						app.standardStreams.output.writeLine(indentation+Terminal.style(optionSettings.description, 'italic'));
						app.standardStreams.output.writeLine();
					}
				});
			}
			else {
				app.standardStreams.output.writeLine();
			}
		}

		var optionsSettings = this.settings.get('options');
		showOptionHelp(optionsSettings);

		var subcommandsSettings = this.settings.get('subcommands');
		if(subcommandsSettings.getSize()) {
			app.standardStreams.output.writeLine(Terminal.style('Subcommands', 'underline')+"\n");
			subcommandsSettings.each(function(subcommandSettingsIndex, subcommandSettings) {
				var line = Terminal.style(subcommandSettings.identifier, 'bold');

				if(subcommandSettings.aliases.length > 1) {
					line += ' ('+subcommandSettings.aliases.slice(1).join(', ')+')';
				}
				//line += Terminal.style(' (default: '+subcommandSettings.defaultValue+')', 'gray');
				app.standardStreams.output.writeLine(line);
				app.standardStreams.output.writeLine();

				if(subcommandSettings.description) {
					app.standardStreams.output.writeLine('  '+Terminal.style(subcommandSettings.description, 'italic'));
					app.standardStreams.output.writeLine();
				}

				// Subcommand options
				if(subcommandSettings.options.getSize()) {
					showOptionHelp(subcommandSettings.options, subcommandSettings.identifier+' ', 2);
				}
			});
		}
		else {
			app.standardStreams.output.writeLine();
		}
	}

	async showDebugCommand() {
		var debugCommand = "\n"+'============================================='+"\n\n";
		debugCommand += Terminal.style('Command Configuration', 'bold');
		debugCommand += "\n\n";
		var indentationSpaces = 0;

		function addOptionsDebugCommandString(debugCommand, options, indentationSpaces = 0) {
			var indentation = ' '.repeat(indentationSpaces);

			if(options.getSize()) {
				debugCommand += indentation+Terminal.style('Options', 'underline')+"\n\n";
				options.each(function(key, value) {
					debugCommand += indentation+'  '+key+': '+Terminal.style(value, 'bold')+"\n";
				});
			}

			return debugCommand;
		}

		debugCommand = addOptionsDebugCommandString(debugCommand, this.options);

		if(this.options.getSize() && this.subcommands.getSize()) {
			debugCommand += "\n";
		}

		if(this.subcommands.getSize()) {
			debugCommand += Terminal.style('Subcommands', 'underline')+"\n";
			this.subcommands.each(function(key, value) {
				debugCommand += "\n"+'  '+Terminal.style(key, 'bold')+"\n\n";
				debugCommand = addOptionsDebugCommandString(debugCommand, value.options, indentationSpaces + 4);
			});
		}

		debugCommand += "\n"+'============================================='+"\n";

		debugCommand = Terminal.style(debugCommand, 'yellow');

		app.standardStreams.output.writeLine(debugCommand);
	}

	async exit(message = null) {
		// Only exit if the app is in a terminal context
		if(app.inTerminalEnvironment()) {
			if(message) {
				app.standardStreams.output.writeLine(message);
			}

			await app.exit();
		}
	}

}

// Export
export { Command };
