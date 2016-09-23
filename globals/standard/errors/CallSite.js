import SourceMapConsumer from 'source-map';

// Class
class CallSite {

	standardCallSite = null;

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

		// Calling standardCallSite.getTypeName() can sometimes throw an error for reasons I don't know, so I use this try catch block to fix it
		try {
			var typeName = standardCallSite.getTypeName();
			this.typeName = typeName;
		}
		catch(error) {
			this.typeName = 'unknown';
		}

		if(standardCallSite.getFunctionName) {
			var functionName = standardCallSite.getFunctionName();
			this.functionName = functionName;
		}
		else {
			this.functionName = 'anonymous';
		}

		if(standardCallSite.getMethodName && standardCallSite.getFunctionName && standardCallSite.getFunctionName() && standardCallSite.getMethodName() != standardCallSite.getFunctionName() && !(standardCallSite.getFunctionName().indexOf('.'+standardCallSite.getMethodName(), standardCallSite.getFunctionName().length - ('.'+standardCallSite.getMethodName()).length) !== -1)) {
			this.methodName = standardCallSite.getMethodName();
		}

		this.file = standardCallSite.getFileName();
		if(this.file) {
			this.fileName = this.file.substr(this.file.lastIndexOf(Node.Path.separator) + 1, this.file.length);
		}
		this.lineNumber = standardCallSite.getLineNumber();
		this.columnNumber = standardCallSite.getColumnNumber();
	}

	getSourceMap() {
		
	}

	// returns the value of this
	getThis() {
		return this.standardCallSite.getThis(...arguments);

	}

	// returns the type of this as a string. This is the name of the function stored in the constructor field of this, if available, otherwise the object's [[Class]] internal property.
	getTypeName () {
		return this.standardCallSite.getTypeName(...arguments);

	}

	// returns the current function
	getFunction () {
		return this.standardCallSite.getFunction(...arguments);

	}

	// returns the name of the current function, typically its name property. If a name property is not available an attempt will be made to try to infer a name from the function's context.
	getFunctionName () {
		return this.standardCallSite.getFunctionName(...arguments);

	}

	// returns the name of the property of this or one of its prototypes that holds the current function
	getMethodName () {
		return this.standardCallSite.getMethodName(...arguments);

	}

	// if this function was defined in a script returns the name of the script
	getFileName () {
		return this.standardCallSite.getFileName(...arguments);

	}

	// if this function was defined in a script returns the current line number
	getLineNumber () {
		return this.standardCallSite.getLineNumber(...arguments);

	}

	// if this function was defined in a script returns the current column number
	getColumnNumber () {
		return this.standardCallSite.getColumnNumber(...arguments);

	}

	// if this function was created using a call to eval returns a CallSite object representing the location where eval was called
	getEvalOrigin () {
		return this.standardCallSite.getEvalOrigin(...arguments);

	}

	// is this a toplevel invocation, that is, is this the global object?
	isToplevel () {
		return this.standardCallSite.isToplevel(...arguments);

	}

	// does this call take place in code defined by a call to eval?
	isEval () {
		return this.standardCallSite.isEval(...arguments);

	}

	// is this call in native V8 code?
	isNative () {
		return this.standardCallSite.isNative(...arguments);

	}

	// is this a constructor call?
	isConstructor () {
		return this.standardCallSite.isConstructor(...arguments);

	}


}

// Export
export default CallSite;
