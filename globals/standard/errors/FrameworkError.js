// Class
var FrameworkError = Class.extend({

	identifier: 'FrameworkError',
	message: null,
	location: null,
	time: new Time(),
	stack: null,
	stackTrace: null,

	construct: function(message) {
		// Create an error
		var error = Error.apply(this, arguments);

		// Set the identifier
		this.identifier = error.name;

		// Set the message
		this.message = error.message;

		// Set the stack trace
		this.stack = error.stack;

		// Set the error on the stack
		this.stack.setError(this);

		// Remove the first three callsites in the stack as they are just about error creation
		//this.stack.shift(3);

		// Set the location using data from the first call site
		var firstCallSite = this.stack.getCallSiteData(0);
		this.location = firstCallSite.file+':'+firstCallSite.lineNumber+':'+firstCallSite.columnNumber;

		// Generate the stack trace string
		this.stackTrace = this.toString();
	},

	toObject: function() {
		var object = {
			identifier: this.identifier,
			message: this.message,
			location: this.location,
			time: this.time,
			stackTrace: this.stackTrace,
		};

		return object;
	},

	toPublicObject: function() {
		var object = this.toObject();
		
		delete object['location'];
		delete object['stackTrace'];

		return object;
	},

	toJson: function() {
		return Json.encode(this.toObject());
	},

	toString: function() {
		//return Json.indent(this.toObject(true));

		//var string = '[Framework] ';
		var string = '';
		
		// The error identifier
		if(this.identifier) {
			string += this.identifier+': ';
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

		// Add the time
		string += '    at '+this.time;

		return string;
	},

});

// Static methods

FrameworkError.is = function(value) {
	return value instanceof FrameworkError;
};

// Export
module.exports = FrameworkError;