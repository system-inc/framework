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
			if(
				value &&
				typeof value === 'object' &&
				value.constructor &&
				value.constructor.name &&
				value.constructor.name != 'String' &&
				value.constructor.name != 'Boolean' &&
				value.constructor.name != 'Number' &&
				value.constructor.name != 'Array' &&
				value.constructor.name != 'Object' &&
				value.constructor.name != 'null'
			) {
				//console.log(value.constructor.name);
				is = true;
			}
		}
		// If a class type is provided
		else if(value instanceof classType) {
			is = true;
		}

		return is;
	}

	static implement(classToReceiveImplementation, classToImplement) {
		// Static properties and methods
		for(var classToImplementProperty in classToImplement) {
			//console.log('classToImplementProperty', classToImplementProperty);
			if(classToReceiveImplementation[classToImplementProperty] === undefined) {
				//console.log(classToImplementProperty, 'does not exist on class, copying');
				classToReceiveImplementation[classToImplementProperty] = Object.clone(classToImplement[classToImplementProperty]);
			}
		}

		// Static own property names
		Object.getOwnPropertyNames(classToImplement).each(function(index, key) {
			//console.log('classToImplement own property', key);
			if(classToReceiveImplementation[key] === undefined) {
				//console.log(key, 'does not exist on class, copying');
				classToReceiveImplementation[key] = Object.clone(classToImplement[key]);
			}
		});

		// Prototype properties and methods
		for(var classToImplementPrototypeProperty in classToImplement.prototype) {
			if(classToReceiveImplementation.prototype[classToImplementPrototypeProperty] === undefined) {
				console.log(classToImplementPrototypeProperty, 'does not exist on class prototype, copying');
				classToReceiveImplementation.prototype[classToImplementPrototypeProperty] = Object.clone(classToImplement.prototype[classToImplementPrototypeProperty]);
			}
		}

		// Prototype own property names
		Object.getOwnPropertyNames(classToImplement.prototype).each(function(index, key) {
			//console.log('classToImplement own property', key);
			if(classToReceiveImplementation.prototype[key] === undefined) {
				console.log(key, 'does not exist on class, copying');
				classToReceiveImplementation.prototype[key] = Object.clone(classToImplement.prototype[key]);
			}
		});
		
		return classToReceiveImplementation;
	}

	static doesImplement(classToCheck, classExpectedToBeImplemented) {
		var doesImplement = true;

		// Check static properties and methods
		for(var key in classExpectedToBeImplemented) {
			if(classToCheck[key] === undefined) {
				//app.info('Class does not have property', key);
				doesImplement = false;
				break;
			}
		}

		// Check static own property names
		if(doesImplement) {
			Object.getOwnPropertyNames(classExpectedToBeImplemented).each(function(index, key) {
				if(classToCheck[key] === undefined) {
					//app.info('Class does not have property', key);
					doesImplement = false;
					return false; // break
				}
			});
		}

		// Check prototype properties and methods
		if(doesImplement) {
			for(var key in classExpectedToBeImplemented.prototype) {
				if(classToCheck.prototype[key] === undefined) {
					app.info('Class does not have prototype property', key);
					doesImplement = false;
					break;
				}
			}
		}

		// Check prototype own property names
		if(doesImplement) {
			Object.getOwnPropertyNames(classExpectedToBeImplemented.prototype).each(function(index, key) {
				if(classToCheck.prototype[key] === undefined) {
					//app.info('Class does not have property', key);
					doesImplement = false;
					return false; // break
				}
			});
		}

		return doesImplement;
	}

	static clone(classDefinition) {
		var clone = Object.assign(Object.create(classDefinition), classDefinition);

		return clone;
	}

	static getClassNameFromInstance(instance) {
		var className = null;

		if(instance) {
			className = Object.prototype.toString.call(instance).match(/^\[object\s(.*)\]$/)[1];
		}

		return className;
	}

	static getMethodNames(classDefinition) {
		//app.log('Class.getMethodNames', classDefinition);

		var methodNames = [];

		for(var key of Object.getOwnPropertyNames(classDefinition.prototype)) {
			methodNames.append(key);
		}

		return methodNames;
	}

	static getStaticPropertyNames(classDefinition) {
	}

	static getInstancePropertyNames(classDefinition) {
		// Need to instance the class in order to get class properties that are not methods
		// This is because the constructor must be called as it assigns properties (this.property = value;)
		var classInstance = new classDefinition();


	}

}

// Global
global.Class = Class;
