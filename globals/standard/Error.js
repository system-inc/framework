// Dependencies
var StackTrace = require('./StackTrace.js');

// I cannot create my own Error class, if I do, the stack trace gets messed up

// Instance properties

Error.prototype.code = null;
Error.prototype.identifier = null;
Error.prototype.message = null;
Error.prototype.location = null;
Error.prototype.data = null;
Error.prototype.url = null;
Error.prototype.time = null;
Error.prototype.stack = null;
Error.prototype.stackTrace = null;
Error.prototype.callSite = null;

// Instance methods

// Create a custom constructor for Error
Error.prototype.construct = function() {
	// Create a new error and capture the stack trace (must do this to get the right line number)
	var error = Error.apply(this, arguments);
	Error.captureStackTrace(error, arguments.callee);

	this.code = 0;

	if(error.name) {
		this.identifier = error.name;
	}
	else {
		this.identifier =  null;
	}

	this.message = error.message;
	this.location = null;
	this.data = null;
	this.url = null;
	this.stack = error.stack;

	// Remove the first three callsites in the stack as they are just about error creation
	this.stack.shift(3);
	
	this.stackTrace = error.stack.toString();

	this.callSite = null;
};

Error.prototype.toObject = function(verbose) {
	var object = {
		code: this.code,
		identifier: this.identifier,
		message: this.message,
		location: this.location,
		data: this.data,
		url: this.url,
		stackTrace: null,
		callSite: this.callSite,
	};

	// Use name for identifier if an identifier is not set
	if(!object.identifier && this.name) {
		object.identifier = this.name;
	}

	// Automatically add any non-standard fields on this error object to error.data
	if(!object.data) {
		object.data = {};

		for(var key in this) {
			if(
				key != 'code' &&
				key != 'name' &&
				key != 'identifier' &&
				key != 'message' &&
				key != 'location' &&
				key != 'data' &&
				key != 'url' &&
				key != 'callSite' &&
				key != 'stackTrace' &&
				this.hasOwnProperty(key) &&
				Primitive.is(this[key])
			) {
				object.data[key] = this[key];
			}
		}
	}
	
	if(verbose) {
		object.stackTrace = this.stack.toString();
	}

	// Add data from the first callsite to the error for convenience
	object.callSite = this.stack.getCallSiteData(0);
	object.location = object.callSite.file+':'+object.callSite.lineNumber+':'+object.callSite.columnNumber;

	return object;
};

Error.prototype.getPublicData = function() {
	var object = this.toObject();

	delete object['data'];
	delete object['location'];
	delete object['stackTrace'];
	delete object['callSite'];

	return object;
};

Error.prototype.toJson = function() {
	return Json.encode(this.toObject());
};

Error.prototype.toString = function() {
	//return Json.indent(this.toObject(true));

	var string = '[Framework] ';
	
	// The error name
	if(this.name) {
		string += this.name+': ';
	}

	// The error message
	if(this.message) {
		var message = this.message.split("\n");
		string += message[message.length - 1]+"\n";
	}

	// Add a new line if we need one
	if(string[string.length - 1] && string[string.length - 1] != "\n") {
		string += "\n";	
	}

	// Add stack trace
	string += this.stack.stackTraceToString();

	return string;
};

// Static properties

// Set the stack trace limit
Error.stackTraceLimit = 100;

// Static methods

// Allow Error to be extended
Error.extend = Class.extend;

// Return an array of CallSite objects instead of a string when error.stack is accessed
Error.prepareStackTrace = function(error, callSites) {
	return new StackTrace(error, callSites);
};

Error.is = function(value) {
	return value instanceof Error;
};

// Export
module.exports = Error;