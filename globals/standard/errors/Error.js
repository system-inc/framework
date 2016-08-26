// Dependencies
//import StackTrace from './StackTrace.js';

// Static properties

//Error.stackTraceLimit = 100;

// Static methods

Error.is = function(value) {
	return value instanceof Error;
};

//Error.prepareStackTrace = function(error, callSites) {
//	// Return an array of CallSite objects instead of a string when error.stack is accessed
//	return new StackTrace(error, callSites);
//};

//Error.toObject = function(error) {
//	var object = {
//		name: error.name,
//		message: error.message,
//		stack: error.stack,
//	};

//	return object;
//};

//Error.toPublicObject = function(error) {
//	var object = {
//		name: error.name,
//		message: error.message,
//	};

//	return object;
//};
