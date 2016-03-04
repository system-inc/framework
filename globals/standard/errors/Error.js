// Dependencies
var StandardError = require('./StandardError.js');

// Class - can not use Class.extend here as it will ruin stack traces
var Error = function() {

	// Instance properties

	this.identifier = null;
	this.message = null;
	this.location = null;
	this.time = new Time();
	this.stack = null;
	this.stackTrace = null;

	// Instance methods

	this.toObject = function() {
		var object = {
			identifier: this.identifier,
			message: this.message,
			location: this.location,
			time: this.time,
			stackTrace: this.stackTrace,
		};

		return object;
	};

	this.getPublicObject = function() {
		var object = this.toObject();
		
		delete object['location'];
		delete object['data'];

		return object;
	};

	this.toJson = function() {
		return Json.encode(this.toObject());
	};

	this.toString = function() {
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
		string += this.stackTrace;

		return string;
	};

	// Construction

	// Use StandardError's constructor to create a standard error object
	var standardError = StandardError.apply(this, arguments);

	// Capture the stack trace for the standard error
	StandardError.captureStackTrace(standardError, arguments.callee);

	// Set the identifier
	this.identifier = standardError.name;

	// Set the message
	this.message = standardError.message;

	// Set the stack trace
	this.stack = standardError.stack;

	// Set the error on the stack
	this.stack.setError(this);

	// Remove the first three callsites in the stack as they are just about error creation
	//this.stack.shift(3);

	// Set the location using data from the first call site
	var firstCallSite = this.stack.getCallSiteData(0);
	this.location = firstCallSite.file+':'+firstCallSite.lineNumber+':'+firstCallSite.columnNumber;

	// Generate the stack trace string
	this.stackTrace = this.stack.stackTraceToString();
};

// Static properties

Error.stackTraceLimit = 100;

// Static methods

Error.extend = Class.extend; // Allow Error to be extended

Error.is = function(value) {
	return value instanceof Error;
};

Error.captureStackTrace = StandardError.captureStackTrace;

Error.prepareStackTrace = StandardError.prepareStackTrace;

// Export
module.exports = Error;