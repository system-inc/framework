ConsoleClass = Class.extend({

	log: null,

	construct: function() {
		this.log = new Log('/var/www/framework/project/logs/', 'console');
		this.listen();
	},

	out: function() {
		// Prepare the message
		var message = Console.prepareMessage(arguments);

		// Write the message to the console
		//console.log.apply(this, arguments); // This invokes the stock console.log method
		console.log(message);
		
		// Write the message to the log
		this.log.write(message);
	},

	prepareMessage: function(passedArguments) {
		var message = '';
		for(var i = 0; i < passedArguments.length; i++) {
			// If we have an object JSON encode it
			if(passedArguments[i] && !passedArguments[i].isString() && passedArguments[i].isObject()) {
				message += "\n"+Json.indent(passedArguments[i]);
			}
			else {
				message += passedArguments[i];	
			}			

			if(i != (passedArguments.length - 1)) {
				message += ' ';
			}
		}

		// Create a new error
		var error = new Error('Error manually created to get stack trace.');

		// Capture the stack trace from the callee
	    Error.captureStackTrace(error, passedArguments.callee);

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

	    //Console.log('Class Name'+': '+className);
	    //Console.log('Method Name'+': '+methodName);
	    //Console.log('File Path'+': '+filePath);
	    //Console.log('File Name'+': '+fileName);
	    //Console.log('Line Number'+': '+lineNumber);
	    //Console.log('Column Number'+': '+columnNumber);

	    message = '['+new Time().getDateTime()+'] ('+fileName+':'+lineNumber+") "+message;

		if(!className) {
	    	message = error.stack;
	    }

	    return message;
	},

	listen: function() {
		//NodeStandardIn.setRawMode(true); // Takes input character by character
		NodeStandardIn.resume();
		NodeStandardIn.setEncoding('utf8');
		NodeStandardIn.on('data', function(data) {
			this.handleCommand(data);
		}.bind(this));
	},

	handleCommand: function(command) {
		//console.log(command);
		if(command.trim() == 'hi') {
			NodeStandardOut.write('hello');
		}
		else {
			NodeStandardOut.write("\n\n");
		}

		// Always write a line break
		NodeStandardOut.write("\n");
	},

});

// Instantiate a global console
Console = new ConsoleClass();