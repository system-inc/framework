Class = function() {};
Class.extend = function(childClassProperties) {
	var initializing = false;
	var functionTest = /xyz/.test(function() {xyz;}) ? /\bparent\b/ : /.*/;
	var parentClassPrototype = this.prototype;

	// Instantiate a base class (but only create the instance, don't run the constructor)
	initializing = true;
	var childClassPrototype = new this();
	initializing = false;

	// Copy the childClassProperties over onto the new childClassPrototype
	for(var childClassProperty in childClassProperties) {
		// If we are overwriting an existing function on the parent then we create a parent (super) method
		if(typeof(childClassProperties[childClassProperty]) == 'function' && typeof(parentClassPrototype[childClassProperty]) == 'function' && functionTest.test(childClassProperties[childClassProperty])) {
			childClassPrototype[childClassProperty] = (function(childClassProperty, method) {
				return function() {
					var parent = this.parent;

					// Add a new .parent() method that is the same method but on the parent-class
					this.parent = parentClassPrototype[childClassProperty];

					// The method only need to be bound temporarily, so we remove it when we're done executing
					var methodResults = method.apply(this, arguments);
					this.parent = parent;

					return methodResults;
				};
			})(childClassProperty, childClassProperties[childClassProperty])
		}
		// If we have a generator
		else if(childClassProperties[childClassProperty] && childClassProperties[childClassProperty].isGenerator && childClassProperties[childClassProperty].isGenerator()) {
			// Keep a reference to the generator method to invoke later in the promise
			var generatorMethod = childClassProperties[childClassProperty];

			// Reassign how generator functions execute: anytime a generator is called we automatically wrap it in a promise and run it
			childClassPrototype[childClassProperty] = function() {
				// Store the instance to apply to the generator method later in the promise
				var childClassInstance = this;

				// Store the arguments to apply to the generator method later in the promise
				var childClassPrototypeArguments = arguments;

				// The promise which runs the generator which resolves the promise
				var promise = Promise.try(function() {
					return new Promise(function(resolve) {
						// Invoke and run the generator with the right context and arguments
						Generator.run(generatorMethod.apply(childClassInstance, childClassPrototypeArguments), resolve);
					});
				});

				return promise;
			}
		}
		// Copy any methods over to the class prototype
		else if(typeof(childClassProperties[childClassProperty]) == 'function') {
			childClassPrototype[childClassProperty] = childClassProperties[childClassProperty];
		}
		// All other class variables (anything not a function) are initialized in the Class() method below
		else {

		}
	}

	// The class constructor
	function Class() {
		// Assign any class variables that are not functions
		for(var childClassProperty in childClassProperties) {
			// Initialize all class variables (anything not a function)
			if(typeof(childClassProperties[childClassProperty]) != 'function') {
				// Clone arrays to localize them to this instantiated object
				// TODO: I need to turn this into a deep copy
				if(Array.is(childClassProperties[childClassProperty])) {
					this[childClassProperty] = childClassProperties[childClassProperty].slice();
				}
				// TODO: I need to clone objects to localize them to the instantiated object
				// Assign anything else where the reference will not be stored
				else {
					this[childClassProperty] = childClassProperties[childClassProperty];
				}
			}
		}

		// All construction is actually done in the construct method
		if(!initializing && this.construct) {
			this.construct.apply(this, arguments);
		}
	}

	// Populate our constructed prototype object
	Class.prototype = childClassPrototype;

	// Enforce the constructor to be what we expect
	Class.prototype.constructor = Class;

	// And make this class extendable
	Class.extend = arguments.callee;

	// Copy over any static methods from the parent class to the child class
	for(var parentClassProperty in parentClassPrototype) {
		if(typeof(parentClassPrototype[parentClassProperty]) == 'function' && parentClassProperty != 'construct' && parentClassProperty != 'constructor') {
			Class[parentClassProperty] = parentClassPrototype[parentClassProperty];
		}
	}

	return Class;
}