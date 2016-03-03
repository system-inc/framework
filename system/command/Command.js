// Dependencies
var Settings = Framework.require('system/settings/Settings.js');

// Class
var Command = Class.extend({

	settings: null,

	command: null,
	file: null,
	arguments: null,
	options: null,

	construct: function(argumentsArray, settings) {
		this.settings = new Settings(settings, {
			usage: '',
			requiredArguments: [],
			optionalArguments: [],
			options: [
				// { option.option: null, option.description: null, option.aliases: [], option.requiredArguments: [], option.optionalArguments: [] }
			],
		});

		// Parse the arguments array
		this.parse(argumentsArray);
	},

	parse: function(argumentsArray) {
		//Console.log(argumentsArray);

		// Make sure we are working with an array
		if(String.is(argumentsArray)) {
			argumentsArray = argumentsArray.split(' ');
		}

		this.command = argumentsArray[0];
		this.file = argumentsArray[1];
		this.arguments = {};
		this.options = {};

		var argumentsToProcess = argumentsArray.slice(2);
		//Console.log(argumentsToProcess); Node.Process.exit();

		// Loop over the options settings
		this.settings.get('options').each(function(index, option) {
			this.options[option.identifier] = this.getOptionValue(option, argumentsToProcess);
		}.bind(this));

		return this;
	},

	getOptionValue: function(option, argumentsArray) {
		var optionIdentifiers = [option.identifier].merge(option.aliases);
		var optionValue = option.defaultValue;

		for(var i = 0; i < argumentsArray.length; i++) {
			if(argumentsArray[i].startsWith('-')) {
				//Console.log(argumentsArray[i], 'is a possible option identifier');

				if(optionIdentifiers.contains(argumentsArray[i].replace('-', ''))) {
					//Console.log(argumentsArray[i], 'is an identifier for the option we are using');

					// If the next item in the arguments array is not an option, set is as the option value
					if((i+1 < argumentsArray.length) && !argumentsArray[i+1].startsWith('-')) {
						// This is a very naive approach and is not robust at all
						optionValue = argumentsArray[i+1];
						break; // Exit the for loop
					}
				}
			}
		}

		return optionValue;
	},

});

// Export
module.exports = Command;