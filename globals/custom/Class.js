// Class
var Class = function() {};

// Static methods

Class.isInstance = function(value, classType) {
	var is = false;

	// If they are just checking to see if is Class
	if(classType === undefined) {
		is = value instanceof Class;
	}
	else {
		is = value instanceof classType;
	}

	return is;
};

Class.doesImplement = function(classToCheck, classExpectedToBeImplemented) {
	var doesImplement = true;

	// Check static properties and methods
	for(var key in classExpectedToBeImplemented) {
		if(classToCheck[key] === undefined) {
			//console.log('Class does not have property', key);
			doesImplement = false;
			break;
		}
	}

	// Check prototype properties and methods
	if(doesImplement) {
		for(var key in classExpectedToBeImplemented.prototype) {
			if(classToCheck.prototype[key] === undefined) {
				//console.log('Class does not have prototype property', key);
				doesImplement = false;
				break;
			}
		}		
	}

	return doesImplement;
};

// This must stay outside of the extend method
var classInitializing = false;

Class.extend = function(childClassProperties) {
	if(childClassProperties === undefined) {
		childClassProperties = {};
	}

	var functionTest = /xyz/.test(function() {xyz;}) ? /\bsuper\b/ : /.*/;
	var parentClass = this;
	var parentClassPrototype = this.prototype;

	// Instantiate a base class (but only create the instance, don't run the constructor)
	classInitializing = true;
	var childClassPrototype = new this();
	classInitializing = false;

	// Copy the childClassProperties over onto the new childClassPrototype
	for(var childClassProperty in childClassProperties) {
		// If we are overwriting an existing function on the parent then we create a super method
		if(typeof(childClassProperties[childClassProperty]) == 'function' && typeof(parentClassPrototype[childClassProperty]) == 'function' && functionTest.test(childClassProperties[childClassProperty])) {
			childClassPrototype[childClassProperty] = (function(childClassProperty, childClassMethod) {
				// If we are overwriting an existing function on the parent with a generator
				if(childClassProperties[childClassProperty].isGenerator && childClassProperties[childClassProperty].isGenerator()) {
					return function*() {
						// Add a new .super() method that is the same method but on the parent class
						this.super = parentClassPrototype[childClassProperty];

						// Execute the method (now .super will be accessible in the method)
						return yield childClassMethod.toPromise().apply(this, arguments);
					}.toPromise();
				}
				// If we are overwriting an existing function on the parent with a normal function
				else {
					return function() {
						// Add a new .super() method that is the same method but on the parent class
						this.super = parentClassPrototype[childClassProperty];

						// Execute the method (now .super will be accessible in the method)
						return childClassMethod.apply(this, arguments);
					};
				}
			})(childClassProperty, childClassProperties[childClassProperty]);
		}
		// If we have a generator
		else if(childClassProperties[childClassProperty] && childClassProperties[childClassProperty].isGenerator && childClassProperties[childClassProperty].isGenerator()) {
			// Turn the generator into a promise
			childClassPrototype[childClassProperty] = childClassProperties[childClassProperty].toPromise();
		}
		// Copy any methods over to the class prototype
		else if(typeof(childClassProperties[childClassProperty]) == 'function') {
			childClassPrototype[childClassProperty] = childClassProperties[childClassProperty];
		}
		// Set a placeholder for all other class variables
		else {
			// These will be initialized in the Class() method below,
			childClassPrototype[childClassProperty] = childClassProperties[childClassProperty];
		}
	}

	// The class constructor
	function Class() {
		// Make class variables from the parent show on this class instance (they are already on this instance's prototype but we want to assign them to make them visible to Json.encode)
		for(var childClassPrototypeProperty in childClassPrototype) { // Loop through the inherited class prototype (came from the parent)
			// Check if we have a property on the inherited parent class prototype that is not in the child class properties (this means the parent class had the variable exposed but the child class will not yet)
			if(childClassProperties[childClassPrototypeProperty] === undefined && typeof(childClassPrototype[childClassPrototypeProperty]) != 'function') {
				// Clone the property to this instance, now the property will appear when this object is encoded with Json.encode
				this[childClassPrototypeProperty] = cloneProperty(childClassPrototype[childClassPrototypeProperty], childClassPrototypeProperty);
			}
		}

		// Handle class variables declared outside of the construct function, assign any class variables that are not functions
		for(var childClassProperty in childClassProperties) {
			// Initialize all class variables (anything not a function)
			if(typeof(childClassProperties[childClassProperty]) != 'function') {
				this[childClassProperty] = cloneProperty(childClassProperties[childClassProperty], childClassProperty);
			}
		}

		// All construction is actually done in the construct method
		if(!classInitializing && this.construct) {
			return this.construct.apply(this, arguments);
		}
	}

	// Use this to clone class variables to localize them to an instantiated object
	function cloneProperty(property, propertyName) {
		// Error.stack is a special property and should not be cloned
		if(propertyName == 'stack') {
			return; // return undefined
		}
		else {
			return Object.clone(property);
		}
	}

	// Populate our constructed prototype object
	Class.prototype = childClassPrototype;

	// Enforce the constructor to be what we expect
	Class.prototype.constructor = Class;

	// And make this class extendable
	Class.extend = arguments.callee;

	// Allow classes to implement other classes
	Class.implement = function(classToImplement) {
		//Class = Node.Utility.inherits(classToImplement);

		for(var classToImplementProperty in classToImplement) {
			//console.log('classToImplementProperty', classToImplementProperty);
			if(Class[classToImplementProperty] === undefined) {
				//console.log(classToImplementProperty, 'does not exist on class, copying');
				Class[classToImplementProperty] = cloneProperty(classToImplement[classToImplementProperty]);
			}
		}

		for(var classToImplementPrototypeProperty in classToImplement.prototype) {
			if(Class.prototype[classToImplementPrototypeProperty] === undefined) {
				//console.log(classToImplementPrototypeProperty, 'does not exist on class prototype, copying');
				Class.prototype[classToImplementPrototypeProperty] = cloneProperty(classToImplement.prototype[classToImplementPrototypeProperty]);
			}
		}
		
		return Class;
	};

	// Copy over any static methods from the parent class prototype to the child class that don't already exist
	for(var parentClassProperty in parentClassPrototype) {
		if(Class[parentClassProperty] === undefined && typeof(parentClassPrototype[parentClassProperty]) == 'function' && parentClassProperty != 'construct' && parentClassProperty != 'constructor') {
			Class[parentClassProperty] = parentClassPrototype[parentClassProperty];
		}
	}

	// Copy over any static methods from the parent class to the child class that don't already exist
	for(var parentClassProperty in parentClass) {
		if(Class[parentClassProperty] === undefined && typeof(parentClass[parentClassProperty]) == 'function' && parentClassProperty != 'construct' && parentClassProperty != 'constructor') {
			Class[parentClassProperty] = parentClass[parentClassProperty];
		}
	}

	return Class;
};

// Export
module.exports = Class;