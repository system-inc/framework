// Dependencies
//import StackTrace from 'framework/globals/standard/errors/StackTrace.js';

// Instance methods

// Error.prototype.toObject = function() {
// 	return Error.toObject(this);
// }

// Error.prototype.toString = function() {
// 	return this.stack.toString();
// }

// Static properties

//Error.stackTraceLimit = 100;

// Static methods

Error.is = function(value) {
	var is = value instanceof Error;

	return is;
};

// Error.prepareStackTrace = function(error, callSites) {
// 	// Return an array of CallSite objects instead of a string when error.stack is accessed
// 	return new StackTrace(error, callSites);
// };

Error.toObject = function(error) {
	var object = {
		name: error.name,
		message: error.message,
		stack: error.stack,
	};

	return object;
};

Error.toPublicObject = function(error) {
	var object = {
		name: error.name,
		message: error.message,
	};

	return object;
};
