// Class
class Class {

	static is(value) {
		var is = false;

		if(value && value.prototype && value === value.prototype.constructor) {
			is = true;
		}

		return is;
	}

	static isInstance(value, classType) {
		var is = false;

		if(value instanceof classType) {
			is = true;
		}

		return is;
	}

	static doesImplement(classToCheck, classExpectedToBeImplemented) {
		var doesImplement = true;

		// Check static properties and methods
		for(var key in classExpectedToBeImplemented) {
			if(classToCheck[key] === undefined) {
				//Console.info('Class does not have property', key);
				doesImplement = false;
				break;
			}
		}

		// Check prototype properties and methods
		if(doesImplement) {
			for(var key in classExpectedToBeImplemented.prototype) {
				if(classToCheck.prototype[key] === undefined) {
					//Console.info('Class does not have prototype property', key);
					doesImplement = false;
					break;
				}
			}
		}

		return doesImplement;
	}

}

// Global
global.Class = Class;
