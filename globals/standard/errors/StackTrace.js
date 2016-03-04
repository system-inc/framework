// Class
var StackTrace = Class.extend({

	error: null,
	callSites: null,
	
	construct: function(error, callSites) {
		this.error = error; // This is orinally the StandardError, later we call StackTrace.setError() to change it to Error

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
		if(this.callSites) {
			for(var i = 0; i < count; i++) {
				this.callSites.shift();
			}
		}
	},

	// WARNING: This method is super fragile and any changes could cause the app to crash and it is super hard to figure out why if this is broken
	getCallSiteData: function(index) {
		var callSiteData = {
			typeName: null,
			functionName: null,
			methodName: null,
			file: null,
			fileName: null,
			lineNumber: null,
			columnNumber: null,
		};

		if(this.callSites) {
			var callSite = this.callSites[index];
		}
				
		if(callSite) {
			// Calling callSite.getTypeName() can sometimes throw an error for reasons I don't know, so I use this try catch block to fix it
			try {
				var typeName = callSite.getTypeName();
				callSiteData.typeName = typeName;
			}
			catch(error) {
				callSiteData.typeName = 'unknown';
			}			

			if(callSite.getFunctionName) {
				var functionName = callSite.getFunctionName();
				callSiteData.functionName = functionName;
			}
			else {
				callSiteData.functionName = 'anonymous';
			}
		
			if(callSite.getMethodName && callSite.getFunctionName && callSite.getFunctionName() && callSite.getMethodName() != callSite.getFunctionName() && !(callSite.getFunctionName().indexOf('.'+callSite.getMethodName(), callSite.getFunctionName().length - ('.'+callSite.getMethodName()).length) !== -1)) {
				callSiteData.methodName = callSite.getMethodName();
			}

			callSiteData.file = callSite.getFileName();
			if(callSiteData.file) {
				callSiteData.fileName = callSiteData.file.substr(callSiteData.file.lastIndexOf(Node.Path.separator) + 1, callSiteData.file.length);	
			}
			callSiteData.lineNumber = callSite.getLineNumber();
			callSiteData.columnNumber = callSite.getColumnNumber();
		}

		return callSiteData;
	},

	setError: function(error) {
		this.error = error;
	},

	// WARNING: This method is super fragile and any changes could cause the app to crash and it is super hard to figure out why if this is broken
	stackTraceToString: function() {
		var string = '';
		
		// Generate the stack track string
		if(this.callSites) {
			for(var i = 0; i < this.callSites.length; i++) {
				var callSite = this.callSites[i];

				string += '    at ';
				
				// Calling callSite.getTypeName() can sometimes throw an error for reasons I don't know, so I use this try catch block to fix it
				var callSiteTypeName;
				try {
					callSiteTypeName = callSite.getTypeName();
				}
				catch(error) {
				}

				// Call site function name
				var callSiteFunctionName;
				try {
					callSiteFunctionName = callSite.getFunctionName();
				}
				catch(error) {
				}

				// Build the string
				if(callSiteTypeName && callSiteFunctionName) {
					string += callSiteTypeName+'.'+callSiteFunctionName;
				}
				else if(callSiteTypeName && !callSiteFunctionName) {
					if(callSiteTypeName == 'Object') {
						string += 'anonymous';
					}
					else {
						string += callSiteTypeName;
					}
				}
				else if(!callSiteTypeName && callSiteFunctionName) {
					string += callSiteFunctionName;
				}
				string += ' ';
			
				if(
					callSite.getMethodName() &&
					callSite.getFunctionName() &&
					callSite.getMethodName() != callSite.getFunctionName() &&
					!(callSite.getFunctionName().indexOf('.'+callSite.getMethodName(), callSite.getFunctionName().length - ('.'+callSite.getMethodName()).length) !== -1)
				) {
					string += '[as '+callSite.getMethodName()+'] ';
				}

				string += '(';
				string += callSite.getFileName()+':';
				string += callSite.getLineNumber()+':';
				string += callSite.getColumnNumber();
				string += ')';
				string += "\n";
			}
		}

		return string;
	},

	// StackTrace.toString is called when errors happen, so we use this.error.toString which will call StackTrace.stackTraceToString
	toString: function() {
		return this.error.toString();
	},

});

// Export
module.exports = StackTrace;