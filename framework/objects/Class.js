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
			childClassPrototype[childClassProperty] = (function(childClassProperty, fn) {
				return function() {
					var temp = this.parent;

					// Add a new .parent() method that is the same method but on the parent-class
					this.parent = parentClassPrototype[childClassProperty];

					// The method only need to be bound temporarily, so we remove it when we're done executing
					var ret = fn.apply(this, arguments);
					this.parent = temp;

					return ret;
				};
			})(childClassProperty, childClassProperties[childClassProperty])
		}
		// If we have a generator
		else if(childClassProperties[childClassProperty] && childClassProperties[childClassProperty].isGenerator && childClassProperties[childClassProperty].isGenerator()) {
			childClassPrototype[childClassProperty] = childClassProperties[childClassProperty];
		}
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