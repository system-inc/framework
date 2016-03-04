// Dependencies
var StackTrace = require('./StackTrace.js');

// Class
var StandardError = Error;

// Static properties

StandardError.stackTraceLimit = 100;

// Static methods

StandardError.captureStackTrace = Error.captureStackTrace;

// Return an array of CallSite objects instead of a string when error.stack is accessed
StandardError.prepareStackTrace = function(error, callSites) {
	return new StackTrace(error, callSites);
};

// Export
module.exports = StandardError;