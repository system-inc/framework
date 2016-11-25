// Dependencies
import * as SourceMapSupport from 'source-map-support';

// Class
class CallSite {

	standardCallSite = null;
	standardCallSiteWithSourceMapApplied = null;

	sourceMap = null;

	typeName = null;
	functionName = null;
	methodName = null;
	file = null;
	fileName = null;
	lineNumber = null;
	columnNumber = null;

	constructor(standardCallSite) {
		this.standardCallSite = standardCallSite;

		// Use source maps
		this.standardCallSiteWithSourceMapApplied = SourceMapSupport.wrapCallSite(this.standardCallSite);

		//console.log('this.standardCallSite', this.standardCallSite);
		//console.log('this.standardCallSiteWithSourceMapApplied', this.standardCallSiteWithSourceMapApplied);

		// Calling this.standardCallSite.getTypeName() can sometimes throw an error for reasons I don't know, so I use this try catch block to fix it
		try {
			var typeName = this.standardCallSiteWithSourceMapApplied.getTypeName();
			this.typeName = typeName;
		}
		catch(error) {
			this.typeName = 'unknown';
		}

		if(this.standardCallSiteWithSourceMapApplied.getFunctionName) {
			var functionName = this.standardCallSiteWithSourceMapApplied.getFunctionName();
			this.functionName = functionName;
		}
		else {
			this.functionName = 'anonymous';
		}

		if(this.standardCallSiteWithSourceMapApplied.getMethodName && this.standardCallSiteWithSourceMapApplied.getFunctionName && this.standardCallSiteWithSourceMapApplied.getFunctionName() && this.standardCallSiteWithSourceMapApplied.getMethodName() != this.standardCallSiteWithSourceMapApplied.getFunctionName() && !(this.standardCallSiteWithSourceMapApplied.getFunctionName().indexOf('.'+this.standardCallSiteWithSourceMapApplied.getMethodName(), this.standardCallSiteWithSourceMapApplied.getFunctionName().length - ('.'+this.standardCallSiteWithSourceMapApplied.getMethodName()).length) !== -1)) {
			this.methodName = this.standardCallSiteWithSourceMapApplied.getMethodName();
		}

		this.file = this.standardCallSiteWithSourceMapApplied.getFileName();
		if(this.file) {
			//console.log('this.file', this.file);
			//console.log('Node.Path.separator', Node.Path.separator);
			//console.log('this.file.lastIndexOf(Node.Path.separator)', this.file.lastIndexOf(Node.Path.separator));
			this.fileName = this.file.substr(this.file.lastIndexOf('/') + 1, this.file.length);
		}
		this.lineNumber = this.standardCallSiteWithSourceMapApplied.getLineNumber();
		this.columnNumber = this.standardCallSiteWithSourceMapApplied.getColumnNumber();
	}

	// returns the value of this
	getThis() {
		return this.standardCallSiteWithSourceMapApplied.getThis(...arguments);
	}

	// returns the type of this as a string. This is the name of the function stored in the constructor field of this, if available, otherwise the object's [[Class]] internal property.
	getTypeName () {
		return this.standardCallSiteWithSourceMapApplied.getTypeName(...arguments);
	}

	// returns the current function
	getFunction () {
		return this.standardCallSiteWithSourceMapApplied.getFunction(...arguments);
	}

	// returns the name of the current function, typically its name property. If a name property is not available an attempt will be made to try to infer a name from the function's context.
	getFunctionName () {
		return this.standardCallSiteWithSourceMapApplied.getFunctionName(...arguments);
	}

	// returns the name of the property of this or one of its prototypes that holds the current function
	getMethodName () {
		return this.standardCallSiteWithSourceMapApplied.getMethodName(...arguments);
	}

	// if this function was defined in a script returns the name of the script
	getFileName () {
		return this.standardCallSiteWithSourceMapApplied.getFileName(...arguments);
	}

	// if this function was defined in a script returns the current line number
	getLineNumber () {
		return this.standardCallSiteWithSourceMapApplied.getLineNumber(...arguments);
	}

	// if this function was defined in a script returns the current column number
	getColumnNumber () {
		return this.standardCallSiteWithSourceMapApplied.getColumnNumber(...arguments);
	}

	// if this function was created using a call to eval returns a CallSite object representing the location where eval was called
	getEvalOrigin () {
		return this.standardCallSiteWithSourceMapApplied.getEvalOrigin(...arguments);
	}

	// is this a toplevel invocation, that is, is this the global object?
	isToplevel () {
		return this.standardCallSiteWithSourceMapApplied.isToplevel(...arguments);
	}

	// does this call take place in code defined by a call to eval?
	isEval () {
		return this.standardCallSiteWithSourceMapApplied.isEval(...arguments);
	}

	// is this call in native V8 code?
	isNative () {
		return this.standardCallSiteWithSourceMapApplied.isNative(...arguments);
	}

	// is this a constructor call?
	isConstructor () {
		return this.standardCallSiteWithSourceMapApplied.isConstructor(...arguments);
	}

}

// Export
export default CallSite;
