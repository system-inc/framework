Arguments = Class.extend({

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
		//Console.out(argumentsArray);

		// Make sure we are working with an array
		if(String.is(argumentsArray)) {
			argumentsArray = argumentsArray.split(' ');
		}

		this.command = argumentsArray[0];
		this.file = argumentsArray[1];
		this.arguments = {};
		this.options = {};

		var requiredArgumentsToUse = Object.clone(this.settings.get('requiredArguments'));
		var optionalArgumentsToUse = Object.clone(this.settings.get('optionalArguments'));

		// Loop over the arguments array, starting at index 2
		for(var i = 2; i < argumentsArray.length; i++) {
			var currentItem = argumentsArray[i];
			var nextItem = argumentsArray.get(i + 1);
			var previousItem = argumentsArray.get(i - 1);
			Console.out('currentItem', currentItem, 'nextItem', nextItem, 'previousItem', previousItem);

			// Check if the current item is an option
			if(currentItem.startsWith('-') || currentItem.startsWith('--')) {
				// Get the potential option with the dash prefix
				potentialOption = value.replaceFirst('-', '');
				if(potentialOption.startsWith('-')) {
					potentialOption = potentialOption.replaceFirst('-', '');
				}

				// FIX THIS --------------------------------
				this.settings.get('options').each(function(index, optionSettings) {
					var options = [optionSettings.option].merge(optionSettings.aliases);

					// Break out of the loop
					if(options.contains(potentialOption)) {
						isOption = optionSettings;
						return false;
					}
				});
			}

			if(optionObject) {
				Console.out('Found an option!', optionObject);

				// TODO: this is broken, assumes nextItem will be the value of the option
				this.options[optionObject.option] = nextItem;
				i++;
			}
			// If we still have required arguments
			else if(requiredArgumentsToUse.length > 0) {
				this.arguments[requiredArgumentsToUse[0].identifier] = currentItem;
				requiredArgumentsToUse.shift();
			}
			// If we still have optional arguments
			else if(optionalArgumentsToUse.length > 0) {
				this.arguments[optionalArgumentsToUse[0].identifier] = currentItem;
				optionalArgumentsToUse.shift();
			}
		}

		return this;
	},

});