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
					var ret = method.apply(this, arguments);
					this.parent = parent;

					return ret;
				};
			})(childClassProperty, childClassProperties[childClassProperty])
		}
		// If we have a generator
		else if(childClassProperties[childClassProperty] && childClassProperties[childClassProperty].isGenerator && childClassProperties[childClassProperty].isGenerator()) {
			// Treat generators just like normal functions
			//childClassPrototype[childClassProperty] = childClassProperties[childClassProperty];
			
			// Automatically pump generators until they are finished
			var method = childClassProperties[childClassProperty];
			childClassPrototype[childClassProperty] = function() {
				// Call with this to preserve context
				var generator = method.apply(this, arguments);

				// The last value received from the generator is the value the method returns
				var value = null;

				// Recursive method will keep running if the generator is not finished
			    var pump = function(currentValue) {
			    	// Store the result
			    	var result = currentValue;

			    	// Advance the generator
			        var next = generator.next(currentValue);

			        // If the generator has finished executing
			        if(next.done) {
			            console.log('Generator pumping finished:', next);

			            result = next.value;
			        }
			        // If the generator has not finished executing
			        else {
			        	console.log('Generator not finished, pumping:', next);

			        	// If we have an object or a function, wrap it in in a promise and bind with done()
			        	if(Object.is(next.value) || Function.is(next.value)) {
			        		// Wrap the current generator value in a promise
				        	var promise = new Promise.promisifyAll(next.value);

				        	// When the promise completes, pump the generator
				        	// I NEED TO SOMEHOW WAIT UNTIL done() IS CALLED BEFORE pump() RETURNS
				        	// DO I NEED TO YIELD HERE?
				        	result = promise.done(function(currentValue) {
				        		result = pump(currentValue);
				        	});
			        	}
			        	// If we don't have an object or function, just pump the generator
			        	else {
			        		result = pump(currentValue);
			        	}
			        }

			        return result;
			    };

			    // Run the recursive pump
			    value = pump();

			    //console.log('Finished recursion!', value, generator);

			    return value;
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