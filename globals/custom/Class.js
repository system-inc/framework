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
		var classToImplementStaticPropertyNames = Class.getStaticPropertyNames(classToImplement);
		console.log('classToImplementStaticPropertyNames', classToImplementStaticPropertyNames);
		classToImplementStaticPropertyNames.each(function(index, staticPropertyName) {
			//console.log('classToImplement staticPropertyName', staticPropertyName);
			if(classToReceiveImplementation[staticPropertyName] === undefined) {
				console.log(staticPropertyName, 'does not exist on class, copying');
				classToReceiveImplementation[staticPropertyName] = Object.clone(classToImplement[staticPropertyName]);
			}
		});

		// Get the instance properties of the class to receieve the implementation
		var instancePropertyNamesOfClassToReceiveImplementation = {};
		Class.getInstanceMethodNames(classToReceiveImplementation).each(function(index, instanceMethodName) {
			instancePropertyNamesOfClassToReceiveImplementation[instanceMethodName] = true;
		});

		// Instance properties
		var classToImplementInstanceMethodNames = Class.getInstanceMethodNames(classToImplement);
		console.log('classToImplementInstanceMethodNames', classToImplementInstanceMethodNames);
		classToImplementInstanceMethodNames.each(function(index, instancePropertyName) {
			console.log('classToImplement instancePropertyName', instancePropertyName);
			if(instancePropertyNamesOfClassToReceiveImplementation[instancePropertyName] === undefined) {
				console.log(instancePropertyName, 'does not exist on class, copying');
				classToReceiveImplementation.prototype[instancePropertyName] = classToImplement.prototype[instancePropertyName];
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
				console.log('Class does not have static property', staticPropertyName);
				doesImplement = false;
				return false; // break
			}
		});

		// Keep checking
		if(doesImplement) {
			// Get the instance properties of the class to check
			var instancePropertyNamesOfClassToCheck = {};
			Class.getInstanceMethodNames(classToCheck).each(function(index, instanceMethodName) {
				instancePropertyNamesOfClassToCheck[instanceMethodName] = true;
			});

			// Instance properties
			Class.getInstanceMethodNames(classExpectedToBeImplemented).each(function(index, instancePropertyName) {
				//console.log('classExpectedToBeImplemented instancePropertyName', instancePropertyName);
				if(instancePropertyNamesOfClassToCheck[instancePropertyName] === undefined) {
					console.log('Class does not have instance property', instancePropertyName);
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
