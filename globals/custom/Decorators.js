// Calls this.stateChanged() when the decorated value changes
global.state = function(classInstance, propertyName, propertyDescriptor) {
	// console.log(arguments);

	// Create an internal variable to store the value of the property
	let internalPropertyName = '_'+propertyName;
	Object.defineProperty(classInstance, internalPropertyName, {
		value: propertyDescriptor.initializer(),
	});

	// Replace the property with a getter and setter which accesses the internal variable
	Object.defineProperty(classInstance, propertyName, {
		get() {
			return this[internalPropertyName];
		},
		set(value) {
			console.log('set', propertyName, value);
			
			let stateChanged = false;
			
			// If the current value is not the same as the new value
			if(this[internalPropertyName] !== value) {
				stateChanged = true;
				this[internalPropertyName] = value;
				this.stateChanged();
			}
		},
	});
}
