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
		//console.log('classToImplementStaticPropertyNames', classToImplementStaticPropertyNames);
		classToImplementStaticPropertyNames.each(function(index, staticPropertyName) {
			//console.log('classToImplement staticPropertyName', staticPropertyName);
			if(classToReceiveImplementation[staticPropertyName] === undefined) {
				//console.log('static property', staticPropertyName, 'does not exist on class, referencing');
				classToReceiveImplementation[staticPropertyName] = classToImplement[staticPropertyName];
			}
		});

		// Instance properties
		var classToImplementInstanceMethodNames = Class.getInstanceMethodNames(classToImplement);
		//console.log('classToImplementInstanceMethodNames', classToImplementInstanceMethodNames);
		classToImplementInstanceMethodNames.each(function(index, instanceMethodName) {
			//console.log('classToImplement instanceMethodName', instanceMethodName);
			if(classToReceiveImplementation.prototype[instanceMethodName] === undefined) {
				//console.log('instance method', instanceMethodName, 'does not exist on class, referencing');
				classToReceiveImplementation.prototype[instanceMethodName] = classToImplement.prototype[instanceMethodName];
			}
		});

		return classToReceiveImplementation;
	}

	static doesImplement(classToCheck, classExpectedToBeImplemented) {
		var doesImplement = true;

		// Static properties
		var classExpectedToBeImplementedStaticPropertyNames = Class.getStaticPropertyNames(classExpectedToBeImplemented);
		//app.log('classExpectedToBeImplementedStaticPropertyNames', classExpectedToBeImplementedStaticPropertyNames);
		classExpectedToBeImplementedStaticPropertyNames.each(function(index, staticPropertyName) {
			//console.log('classExpectedToBeImplemented staticPropertyName', staticPropertyName);
			if(classToCheck[staticPropertyName] === undefined) {
				//console.log('Class does not have static property', staticPropertyName);
				doesImplement = false;
				return false; // break
			}
		});

		// Keep checking
		if(doesImplement) {
			// Instance properties
			var classExpectedToBeImplementedInstanceMethodNames = Class.getInstanceMethodNames(classExpectedToBeImplemented);
			//app.log('classExpectedToBeImplementedInstanceMethodNames', classExpectedToBeImplementedInstanceMethodNames);
			classExpectedToBeImplementedInstanceMethodNames.each(function(index, instanceMethodName) {
				//console.log('classExpectedToBeImplemented instanceMethodName', instanceMethodName);
				if(classToCheck.prototype[instanceMethodName] === undefined) {
					//console.log('Class does not have instance method', instanceMethodName);
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
		var currentClassDefinition = classDefinition;

		do {
			// Stop at the top level Function prototype
			if(currentClassDefinition === Function.prototype) {
				break;
			}

			var propertyNames = Object.getOwnPropertyNames(currentClassDefinition);
			propertyNames.forEach(function(propertyName){
				if(
					propertyName !== 'length' &&
					propertyName !== 'name' &&
					propertyName !== 'prototype' &&
					staticPropertyNames.indexOf(propertyName) === -1
				) {
					staticPropertyNames.append(propertyName);
				}
			});
		}
		while(currentClassDefinition = Object.getPrototypeOf(currentClassDefinition));

		return staticPropertyNames;
	}

	static getInstanceMethodNames(classDefinition) {
		var instanceMethodNames = [];
		var currentPrototype = classDefinition.prototype;

		do {
			// Stop at the top level Object prototype
			if(currentPrototype === Object.prototype) {
				break;
			}

			var propertyNames = Object.getOwnPropertyNames(currentPrototype);
			propertyNames.forEach(function(propertyName) {
				if(
					propertyName !== 'constructor' &&
					instanceMethodNames.indexOf(propertyName) === -1
				) {
					instanceMethodNames.append(propertyName);
				}
			});
		}
		while(currentPrototype = Object.getPrototypeOf(currentPrototype));

		//console.log('instanceMethodNames', instanceMethodNames);

		return instanceMethodNames;
	}

}

// Global
global.Class = Class;
