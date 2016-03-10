// Dependencies
var StackTrace = require('./StackTrace.js');

// Static properties

Error.stackTraceLimit = 100;

// Static methods

Error.is = function(value) {
	return value instanceof Error;
};

Error.prepareStackTrace = function(error, callSites) {
	// Return an array of CallSite objects instead of a string when error.stack is accessed
	return new StackTrace(error, callSites);
};

Error.extend = Class.extend; // Make Error extendable

Error.toObject = function(error) {
	var object = {
		name: error.name,
		message: error.message,
		stack: error.stack,
	};

	return object;
};

// Export
module.exports = Error;