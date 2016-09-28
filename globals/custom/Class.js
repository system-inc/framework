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
		// Static properties
		Class.getStaticPropertyNames(classToImplement).each(function(index, staticPropertyName) {
			//console.log('classToImplement staticPropertyName', staticPropertyName);
			if(classToReceiveImplementation[staticPropertyName] === undefined) {
				//console.log(staticPropertyName, 'does not exist on class, copying');
				classToReceiveImplementation[staticPropertyName] = Object.clone(classToImplement[staticPropertyName]);
			}
		});

		// Get the instance properties of the class to receieve the implementation
		var instancePropertyNamesOfClassToReceiveImplementation = {};
		Class.getInstancePropertyNames(classToReceiveImplementation).each(function(index, key) {
			instancePropertyNamesOfClassToReceiveImplementation[key] = true;
		});

		// Instance properties
		Class.getInstancePropertyNames(classToImplement).each(function(index, instancePropertyName) {
			//console.log('classToImplement instancePropertyName', instancePropertyName);
			if(instancePropertyNamesOfClassToReceiveImplementation[instancePropertyName] === undefined) {
				//console.log(instancePropertyName, 'does not exist on class, copying');
				classToReceiveImplementation.prototype[instancePropertyName] = Object.clone(classToImplement.prototype[instancePropertyName]);
			}
		});

		return classToReceiveImplementation;
	}

	static doesImplement(classToCheck, classExpectedToBeImplemented) {
		var doesImplement = true;

		// Static properties
		Class.getStaticPropertyNames(classExpectedToBeImplemented).each(function(index, staticPropertyName) {
			//console.log('classExpectedToBeImplemented staticPropertyName', staticPropertyName);
			if(classToCheck[staticPropertyName] === undefined) {
				//console.log('Class does not have static property', staticPropertyName);
				doesImplement = false;
				return false; // break
			}
		});

		// Keep checking
		if(doesImplement) {
			// Get the instance properties of the class to check
			var instancePropertyNamesOfClassToCheck = {};
			Class.getInstancePropertyNames(classToCheck).each(function(index, key) {
				instancePropertyNamesOfClassToCheck[key] = true;
			});

			// Instance properties
			Class.getInstancePropertyNames(classExpectedToBeImplemented).each(function(index, instancePropertyName) {
				//console.log('classExpectedToBeImplemented instancePropertyName', instancePropertyName);
				if(instancePropertyNamesOfClassToCheck[instancePropertyName] === undefined) {
					//console.log('Class does not have instance property', instancePropertyName);
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

	static getStaticPropertyNames(classDefinition) {
		var staticPropertyNames = [];

		Object.getOwnPropertyNames(classDefinition).each(function(index, key) {
			if(
				key != 'length' &&
				key != 'name' &&
				key != 'prototype'
			) {
				staticPropertyNames.append(key);	
			}
		});

		return staticPropertyNames;
	}

	static getInstancePropertyNames(classDefinition) {
		var instancePropertyNames = [];

		// One option is to update babel to define the class properties outside of the constructor
		/*
			Instead of

			constructor() {
				this.blah = 'blah';
			}

			do

			ClassName.prototype.blah = 'blah';
		*/

		// Need to instance the class in order to get class properties that are not methods
		// This is because the constructor must be called as it assigns properties (this.property = value;)
		// I know, this is terrible, other options are to parse the function string though
		//var classInstance = new classDefinition();

		//// Get the instance properties from the instance
		//Object.keys(classInstance).each(function(index, key) {
		//	instancePropertyNames.append(key);
		//});

		// Get the instance methods from the definition
		var instanceMethodNames = Class.getInstanceMethodNames(classDefinition);

		instancePropertyNames.merge(instanceMethodNames);

		return instancePropertyNames;
	}

	static getInstanceMethodNames(classDefinition) {
		var methodNames = [];

		Object.getOwnPropertyNames(classDefinition.prototype).each(function(index, key) {
			if(
				key !== 'constructor' &&
				Function.is(classDefinition.prototype[key])
			) {
				methodNames.append(key);
			}
		});

		return methodNames;
	}

}

// Global
global.Class = Class;
