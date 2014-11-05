Arguments = Class.extend({

	usage: '',
	requiredArguments: [],
	optionalArguments: [],
	options: [],

	construct: function(format) {
		if(format !== undefined && Object.is(format)) {
			if(format.usage) {
				this.usage = format.usage;
			}
			if(format.requiredArguments) {
				this.requiredArguments = format.requiredArguments;
			}
			if(format.optionalArguments) {
				this.optionalArguments = format.optionalArguments;
			}
			if(format.options) {
				this.options = format.options;
			}

			this.options.each(function(index, option) {
				if(!option.option) {
					option.option = null;
				}
				if(!option.description) {
					option.description = null;
				}
				if(!option.aliases) {
					option.aliases = [];
				}
				if(!option.requiredArguments) {
					option.requiredArguments = [];
				}
				if(!option.optionalArguments) {
					option.optionalArguments = [];
				}
			});
		}
	},

	parse: function(argumentsArray) {
		//Console.out(argumentsArray);

		// Make sure we are working with an array
		if(String.is(argumentsArray)) {
			argumentsArray = argumentsArray.split(' ');
		}

		var parsedResults = {
			command: argumentsArray[0],
			file: argumentsArray[1],
			arguments: {},
			options: {},
		};

		var requiredArgumentsToUse = Object.clone(this.requiredArguments);
		var optionalArgumentsToUse = Object.clone(this.optionalArguments);

		// Loop over the arguments array, starting at index 2
		for(var i = 2; i < argumentsArray.length; i++) {
			var currentItem = argumentsArray[i];
			var nextItem = argumentsArray.get(i + 1);
			var previousItem = argumentsArray.get(i - 1);

			// Check if the current item is an option
			var optionObject = this.isOption(currentItem);
			if(optionObject) {
				//Console.out('Found an option!', optionObject);

				// TODO: this is broken, assumes nextItem will be the value of the option
				parsedResults.options[optionObject.option] = nextItem;
				i++;
			}
			// If we still have required arguments
			else if(requiredArgumentsToUse.length > 0) {
				parsedResults.arguments[requiredArgumentsToUse[0].identifier] = currentItem;
				requiredArgumentsToUse.shift();
			}
			// If we still have optional arguments
			else if(optionalArgumentsToUse.length > 0) {
				parsedResults.arguments[optionalArgumentsToUse[0].identifier] = currentItem;
				optionalArgumentsToUse.shift();
			}
		}

		return parsedResults;
	},

	isOption: function(value) {
		var isOption = false;

		if(value.startsWith('-') || value.startsWith('--')) {
			// Get the potential option with the dash prefix
			potentialOption = value.replaceFirst('-', '');
			if(potentialOption.startsWith('-')) {
				potentialOption = potentialOption.replaceFirst('-', '');
			}

			this.options.each(function(index, currentOption) {
				var options = [currentOption.option].merge(currentOption.aliases);

				// Break out of the loop
				if(options.contains(potentialOption)) {
					isOption = currentOption;
					return false;
				}
			});
		}

		return isOption;
	},

});

// Static methods
Arguments.parse = function(argumentsArray, argumentsFormat) {
	var arguments = new Arguments(argumentsFormat);

	return arguments.parse(argumentsArray);
}