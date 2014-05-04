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
			// Treat generators just like normal functions
			//childClassPrototype[childClassProperty] = childClassProperties[childClassProperty];
			
			// Keep a reference to the generator method to invoke later in the promise
			var generatorMethod = childClassProperties[childClassProperty];

			// Reassign how generator functions execute: anytime a generator is called we automatically wrap it in a promise and run it
			childClassPrototype[childClassProperty] = function() {
				// Store the instance to apply to the generator method later in the promise
				var childClassInstance = this;

				// Store the arguments to apply to the generator method later in the promise
				var childClassPrototypeArguments = arguments;

				// Setup a new promise to run in the generator
				var promise = new Promise(function(resolve) {
					// Store the resolve method on the instance
					childClassInstance.resolve = resolve;

					// Invoke and run the generator with the right context and arguments, it must use the this.resolve function to resolve
					Generator.run(generatorMethod.apply(childClassInstance, childClassPrototypeArguments), resolve);
				});

				// Return the promise which runs the generator which resolves the promise
				return promise;
			}
		}
		// All other methods
		else {
			childClassPrototype[childClassProperty] = childClassProperties[childClassProperty];
		}
	}

	// The class constructor
	function Class() {
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