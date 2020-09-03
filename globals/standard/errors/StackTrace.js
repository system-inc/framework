// Dependencies
import { CallSite } from '@framework/globals/standard/errors/CallSite.js';

// Class
class StackTrace {

	error = null;
	callSites = [];

	constructor(error, standardCallSites) {
		this.error = error;
		this.processStandardCallSites(standardCallSites);
	}

	processStandardCallSites(standardCallSites) {
		standardCallSites.each(function(index, standardCallSite) {
			this.callSites.append(new CallSite(standardCallSite));
		}.bind(this));
	}

	shift(count) {
		if(this.callSites) {
			for(var i = 0; i < count; i++) {
				this.callSites.shift();
			}
		}
	}

	// WARNING: This method is super fragile and any changes could cause the app to crash and it is super hard to figure out why if this is broken
	getCallSite(index) {
		return this.callSites[index];
	}

	// WARNING: This method is super fragile and any changes could cause the app to crash and it is super hard to figure out why if this is broken
	stackTraceToString() {
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

			string = string.replaceLast("\n", '');
		}

		return string;
	}

	toString() {
		var string = '';

		// The error identifier
		string += this.error.name+': ';

		// The error message
		if(this.error.message) {
			string += this.error.message;
		}
		else {
			string += '(no error message)';
		}

		// Add a new line if we need one
		if(string[string.length - 1] && string[string.length - 1] != "\n") {
			string += "\n";
		}

		// Add stack trace
		string += this.stackTraceToString();

		return string;
	}

	// Allow calls to error.stack.indexOf (because error.stack is not a string)
	indexOf() {
		return this.toString().indexOf(...arguments);
	}

	// Allow calls to error.stack.replace (because error.stack is not a string)
	replace() {
		return this.toString().replace(...arguments);
	}

	// Allow calls to error.stack.startsWith (because error.stack is not a string)
	startsWith() {
		return this.toString().startsWith(...arguments);
	}

	// Allow calls to error.stack.slice (because error.stack is not a string)
	slice() {
		return this.toString().slice(...arguments);
	}

	// Allow calls to error.stack.split (because error.stack is not a string)
	split() {
		return this.toString().split(...arguments);
	}

}

// Export
export { StackTrace };
