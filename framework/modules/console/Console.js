ConsoleClass = Class.extend({

	identifier: null,
	log: null,

	construct: function(identifier) {
		this.identifier = (identifier === undefined ? this.identifier : identifier);

		// Listen for incoming commands from standard in
		this.listen();
	},

	write: function(message) {
		// Write the message to the console
		console.log(message);
		
		// If we have a log, write the message to it
		if(this.log) {
			this.log.write(message+"\n");
		}
	},

	out: function() {
		// Prepare the message
		var message = Console.prepareMessage(arguments);
		//console.log.apply(this, arguments); // This invokes the stock console.log method

		this.write(message);
	},

	highlight: function() {
		// Prepare the message
		var message = Console.prepareMessage(arguments);

		// Wrap the message in ASCII
		message = "\x1B[90m\n\n                                                |>>>\r\n                                                |\r\n                                            _  _|_  _\r\n                                           |;|_|;|_|;|\r\n                                           \\\\.    .  \/\r\n                                            \\\\:  .  \/\r\n                                             ||:   |\r\n                                             ||:.  |\r\n                                             ||:  .|\r\n                                             ||:   |       \\,\/\r\n                                             ||: , |            \/`\\\r\n                                             ||:   |\r\n                                             ||: . |\r\n              __                            _||_   |\r\n     ____--`~    \'--~~__            __ ----~    ~`---,              ___\r\n-~--~                   ~---__ ,--~\'                  ~~----_____-~\'   `~----~~\n\n\n\n\x1B[39m"+"\x1B[32m"+message+"\x1B[39m"+"\n\n";

		this.write(message);
	},

	attachLog: function(directory) {
		this.log = new Log(directory, this.identifier);
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
	    	//message = error.stack;
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
Console = new ConsoleClass('console');