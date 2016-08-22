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

		// If we are just checking to see if the value is an instance of any class type
		if(!classType) {
			if(typeof value === 'function' && /^\s*class\s+/.test(value.toString())) {
				is = true;
			}
		}
		// If a class type is provided
		else if(value instanceof classType) {
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

	static clone(classDefinition) {
		var clone = Object.assign(Object.create(classDefinition), classDefinition);

		return clone;
	}

}

// Global
global.Class = Class;
