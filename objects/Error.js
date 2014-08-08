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

	toString: function() {
		var string = '';

		// The error name
		if(this.error && this.error.name) {
			string += this.error.name+': ';
		}

		// The error message
		if(this.error && this.error.message) {
			var message = this.error.message.split("\n");
			string += message[message.length - 1]+"\n";
		}
		
		// Generate the stack track string
		for(var i = 0; i< this.callSites.length; i++) {
			var callSite = this.callSites[i];
		
			string += "    at ";
			string += callSite.getTypeName()+'.';

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

// Set the stack trace limit
Error.stackTraceLimit = 100;

// Return an array of CallSite objects instead of a string when error.stack is accessed
Error.prepareStackTrace = function(error, callSites) {
	return new StackTrace(error, callSites);
}

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
	this.stackTrace = error.stack.toString();
}

// Allow Error to be extended
Error.extend = Class.extend;