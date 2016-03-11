// Dependencies
var Settings = Framework.require('system/settings/Settings.js');
var Version = Framework.require('system/version/Version.js');

// Class
var Command = Class.extend({

	settings: null,

	version: null,
	command: null,
	file: null,
	arguments: null,
	options: null,

	construct: function(argumentsArray, settings) {
		this.settings = new Settings(settings, {
			version: null,
			usage: '',
			requiredArguments: [],
			optionalArguments: [],
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

		// Set the version
		var versionSettings = this.settings.get('version');
		if(versionSettings) {
			this.version = new Version(versionSettings);
		}

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
	},

	parse: function(argumentsArray) {
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

		// Version
		if(Command.versionOptions.contains(this.argumentToOptionIdentifier(argumentsToProcess.first()))) {
			this.showVersion();
		}
		// Help
		else if(Command.helpOptions.contains(this.argumentToOptionIdentifier(argumentsToProcess.first()))) {
			this.showHelp();
		}

		// Loop over the options settings
		this.settings.get('options').each(function(index, optionSettings) {
			// Set the option value
			this.options[optionSettings.identifier] = this.getOptionValue(optionSettings, argumentsToProcess);
		}.bind(this));

		//Node.exit(this);

		return this;
	},

	showVersion: function() {
		Console.writeLine('Version '+this.version.toString());

		Node.exit();
	},

	showHelp: function() {
		Console.writeLine('Help');
		Console.writeLine(this);

		Node.exit();
	},

	getOptionValue: function(optionSettings, argumentsArray) {
		//Node.exit(argumentsArray);

		var optionValue = optionSettings.defaultValue;
		
		for(var i = 0; i < argumentsArray.length; i++) {
			// Check to see if the current argument matches the current option
			if(optionSettings.identifiers.contains(this.argumentToOptionIdentifier(argumentsArray[i]))) {
				//Console.info('optionSettings.identifier', optionSettings.identifier, 'matches', '"'+this.argumentToOptionIdentifier(argumentsArray[i])+'"');
				//Console.log('current argument', argumentsArray[i]);
				//Console.log('next argument', argumentsArray[i + 1]);

				var currentArgumentOptionSettingsFromOptionIdentifier = this.getOptionSettingsFromOptionIdentifier(argumentsArray[i]);
				//Console.log('currentArgumentOptionSettingsFromOptionIdentifier', currentArgumentOptionSettingsFromOptionIdentifier);
				var nextArgumentOptionSettingsFromNextOptionIdentifier = this.getOptionSettingsFromOptionIdentifier(argumentsArray[i + 1]);
				//Console.log('nextArgumentOptionSettingsFromNextOptionIdentifier', nextArgumentOptionSettingsFromNextOptionIdentifier);
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
	},

	argumentToOptionIdentifier: function(argument) {
		var optionIdentifier = null;

		if(argument && String.is(argument)) {
			optionIdentifier = argument.replace('-', '');
		}

		return optionIdentifier;
	},

	getOptionValueFromArgumentUsingOptionSettings: function(optionSettings, argument) {
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
	},

	getOptionSettingsFromOptionIdentifier: function(optionIdentifier) {
		//Console.info('getOptionSettingsFromOptionIdentifier', 'optionIdentifier', optionIdentifier);

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
	},

});

// Static properties

Command.versionOptions = [
	'v',
	'version',
];

Command.helpOptions = [
	'?',
	'help',
];

// Export
module.exports = Command;