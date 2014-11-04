// Allow Error to be extended
Error.extend = Class.extend;

// Set the stack trace limit
Error.stackTraceLimit = 100;

// Return an array of CallSite objects instead of a string when error.stack is accessed
Error.prepareStackTrace = function(error, callSites) {
	return new StackTrace(error, callSites);
}

// Declare the properties of the Error prototype
Error.prototype.code = null;
Error.prototype.identifier = null;
Error.prototype.message = null;
Error.prototype.url = null;
Error.prototype.stack = null;
Error.prototype.stackTrace = null;

// Create a custom constructor for Error
Error.prototype.construct = function() {
	// Create a new error and capture the stack trace
	//var error = this;
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
	this.url = null;
	this.stack = error.stack;

	// Remove the first three callsites in the stack as they are just about error creation
	this.stack.shift(3);
	
	this.stackTrace = this.stack.toString();
}

Error.prototype.toObject = function(verbose) {
	var object = {
		'code': this.code,
		'identifier': this.identifier,
		'message': this.message,
		'url': this.url,
	};

	// Use name for identifier if an identifier is not set
	if(!object.identifier && this.name) {
		object.identifier = this.name;
	}

	if(verbose) {
		object.stackTrace = this.stack.toString();
	}

	return object;
}

Error.prototype.toJson = function() {
	return Json.encode(this.toObject());
}

StackTrace = Class.extend({

	error: null,
	callSites: null,
	
	construct: function(error, callSites) {
		this.error = error;
		// CallSite properties:
		//   getThis: returns the value of this
		//   getTypeName: returns the type of this as a string. This is the name of the function stored in the constructor field of this, if available, otherwise the object's [[Class]] internal property.
		//   getFunction: returns the current function
		//   getFunctionName: returns the name of the current function, typically its name property. If a name property is not available an attempt will be made to try to infer a name from the function's context.
		//   getMethodName: returns the name of the property of this or one of its prototypes that holds the current function
		//   getFileName: if this function was defined in a script returns the name of the script
		//   getLineNumber: if this function was defined in a script returns the current line number
		//   getColumnNumber: if this function was defined in a script returns the current column number
		//   getEvalOrigin: if this function was created using a call to eval returns a CallSite object representing the location where eval was called
		//   isToplevel: is this a toplevel invocation, that is, is this the global object?
		//   isEval: does this call take place in code defined by a call to eval?
		//   isNative: is this call in native V8 code?
		//   isConstructor: is this a constructor call?
		this.callSites = callSites;
	},

	shift: function(count) {
		for(var i = 0; i < count; i++) {
			this.callSites.shift();
		}
	},

	getCallSite: function(index) {
		return this.callSites[index];
	},

	// WARNING: This method is super fragile and any changes could cause the app to crash and it is super hard to figure out why if this is broken
	toString: function() {
		var string = '[Framework] ';
		
		// The error name
		if(this.error && this.error.name) {
			string += this.error.name+': ';
		}

		// The error message
		if(this.error && this.error.message) {
			var message = this.error.message.split("\n");
			string += message[message.length - 1]+"\n";
		}

		// Add a new line if we need one
		if(string[string.length - 1] && string[string.length - 1] != "\n") {
			string += "\n";	
		}		
		
		// Generate the stack track string
		for(var i = 0; i< this.callSites.length; i++) {
			var callSite = this.callSites[i];

			string += "    at ";

			// Calling callSite.getTypeName() can sometimes throw an error for reasons I don't know, so I use this try catch block to fix it
			try {
				string += callSite.getTypeName()+'.';	
			}
			catch(error) {
				string += '<unknown>.';
			}			

			if(callSite.getFunctionName()) {
				string += callSite.getFunctionName()+' ';
			}
			else {
				string += '<anonymous>'+' ';
			}
		
			if(callSite.getMethodName() && callSite.getFunctionName() && callSite.getMethodName() != callSite.getFunctionName() && !(callSite.getFunctionName().indexOf('.'+callSite.getMethodName(), callSite.getFunctionName().length - ('.'+callSite.getMethodName()).length) !== -1)) {
				string += '[as '+callSite.getMethodName()+'] ';
			}

			string += '(';
			string += callSite.getFileName()+':';
			string += callSite.getLineNumber()+':';
			string += callSite.getColumnNumber();
			string += ')';
			string += "\n";
		}

		return string;
	},

});