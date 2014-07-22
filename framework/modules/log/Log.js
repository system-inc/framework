LogClass = Class.extend({

	buffer: '',

	log: function() {
		var message = '';
		for(var i = 0; i < arguments.length; i++) {
			// If we have an object JSON encode it
			if(arguments[i] && !arguments[i].isString() && arguments[i].isObject()) {
				message += "\n"+Json.indent(arguments[i]);
			}
			else {
				message += arguments[i];	
			}			

			if(i != (arguments.length - 1)) {
				message += ' ';
			}
		}

		// Create a new error
		var error = new Error('Error manually created to get stack trace.');

		// Capture the stack trace from the callee
	    Error.captureStackTrace(error, arguments.callee);

	    // Format the stack trace
	    var stackTraceLines = error.stack.split("\n");
	    var className = '';
		var methodName = '';
		var filePath = '';
		var fileName = '';
		var lineNumber = '';
		var columnNumber = '';
	    if(stackTraceLines[1]) {
		    className = stackTraceLines[1].match(/at\s(.*?)\s/);
		    if(className) {
		    	className = className[1];
		    }

		    methodName = stackTraceLines[1].match(/at\s(.*?)\s/);
		    if(methodName) {
		    	methodName = methodName[1].split('.').reverse()[0];
		    }

		    filePath = stackTraceLines[1].match(/.*\s(.*?):/);
		    if(filePath) {
		    	filePath = filePath[1];
		    }

		    fileName = stackTraceLines[1].match(/.*\s(.*?):/);
	    	if(fileName) {
				fileName = fileName[1].split('/').reverse()[0];
	    	}

		    lineNumber = stackTraceLines[1].match(/:(.*?):/);
		    if(lineNumber) {
		    	lineNumber = lineNumber[1];
		    }

		    columnNumber = stackTraceLines[1].match(/:\d+:(\d+)/);	
		    if(columnNumber) {
		    	columnNumber = columnNumber[1];
		    }
	    }

	    // Handle classes extending Class
	    if(className && className.startsWith('Class')) {
	    	className = fileName.replace('.js', '');
	    }

	    // Log.log('Class Name'+': '+className);
	    // Log.log('Method Name'+': '+methodName);
	    // Log.log('File Path'+': '+filePath);
	    // Log.log('File Name'+': '+fileName);
	    // Log.log('Line Number'+': '+lineNumber);
	    // Log.log('Column Number'+': '+columnNumber);

	    var log = '['+new Time().getDateTime()+'] ('+fileName+':'+lineNumber+") "+message;
		console.log(log);
		if(!className) {
	    	console.log(error.stack);
	    }

	    Log.write(log);

		return this;
	},

	write: function*(string) {
		// Make sure we have something to write
		if(!string) {
			return;
		}

		// Add a line break at the end of every log string
		string += "\n";

		// If there is no file and the LogModule is initialized
		if(!this.file && global['LogModule']) {
			var path = LogModule.settings.get('file.path');
			this.file = yield File.open(path, 'a');
		}

		// If we have a file
		if(this.file) {
			// If we have data in the buffer
			if(this.buffer) {
				string = this.buffer + string;
				this.buffer = null;
			}

			File.write(this.file, string);
		}
		// If we have no log file store messages in a buffer to be written when we have a file to write to
		else {
			this.buffer += string;
		}
	}

});

// Create the global log
Log = new LogClass();