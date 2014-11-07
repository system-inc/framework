Class = function() {};

Class.is = function(value, classType) {
	var is = false;

	// If they are just checking to see if is Class
	if(classType === undefined) {
		is = value instanceof Class;
	}
	else {
		is = value instanceof classType;
	}

	return is;
}

var classInitializing = false; // This must stay outside of the extend method
Class.extend = function(childClassProperties) {
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
			childClassPrototype[childClassProperty] = (function(childClassProperty, method) {
				return function() {
					// Have to store it as superMethod here because super is a reserved word when not in a class context
					var superMethod = this.super;

					// Add a new .super() method that is the same method but on the parent-class
					this.super = parentClassPrototype[childClassProperty];

					// The method only need to be bound temporarily, so we remove it when we're done executing
					var methodResults = method.apply(this, arguments);
					this.super = superMethod;

					return methodResults;
				};
			})(childClassProperty, childClassProperties[childClassProperty])
		}
		// If we have a generator
		else if(childClassProperties[childClassProperty] && childClassProperties[childClassProperty].isGenerator && childClassProperties[childClassProperty].isGenerator()) {
			// Keep track of the original generator function parameters before we overwrite the generator function
			var originalChildClassGeneratorParameters = childClassProperties[childClassProperty].getParameters();

			// Use a closure to generate a new, unique anonymous function which returns a promise which will resolve when the method completes execution
			childClassPrototype[childClassProperty] = (function(childClassProperty, generatorMethod) {
				var fn = function() {
					// Invoke the generator with the right context and arguments
					var invokedGeneratorMethod = generatorMethod.apply(this, arguments);

					var promise = new Promise(function(resolve, reject) {
						// Run the invoked generator
						Generator.run(invokedGeneratorMethod, resolve, reject);
					});

					// Catch and rethrow any errors
					//promise.catch(function(error) {
					//	Console.out('Caught error at Class.js:', error.message);
					//	throw(error);
					//});

					// All generators return a promise
					return promise;
				};

				// You'll judge me for this in the future, but this is the only way I can store parameters for generator functions
				fn.parameters = originalChildClassGeneratorParameters;

				return fn;
			})(childClassProperty, childClassProperties[childClassProperty])
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
			return this.construct.apply(this, arguments); // The return here allows a construct method to return a new Object other than itself
		}
	}

	// Use this to clone class variables to localize them to an instantiated object
	function cloneProperty(property, propertyName) {
		// Error.stack is a special property and should not be cloned
		if(propertyName == 'stack') {
			return; // return undefined
		}
		// Clone non-primitives to localize them to this instantiated object
		else if(!Primitive.is(property)) {
			// We can only clone simple arrays [] and simple objects {} that do not contain references to any classes
			var isInstanceOfClass = property.constructor.toString().startsWith('function Class()');
			if(!isInstanceOfClass) {
				//console.log('Cloning assumed non-primitive, simple object:', propertyName, typeof(property), property);
				return Object.clone(property);
			}
			else {
				console.log('Error: Simple arrays [] and objects {} may be declared as class variables, but you may not instantiate an instance of class in a class variable definition. Any construction of a new class as a class variable must occur in the construct() method. Move the instantiation of "'+propertyName+'"" to the construct() methood.');
				return; // return undefined
			}
		}
		// All primitives can be assigned directly
		else {
			return property;
		}
	}

	// Populate our constructed prototype object
	Class.prototype = childClassPrototype;

	// Enforce the constructor to be what we expect
	Class.prototype.constructor = Class;

	// And make this class extendable
	Class.extend = arguments.callee;

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
}