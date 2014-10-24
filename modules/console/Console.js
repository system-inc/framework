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

		return message;
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
		// Build the message
		var message = '';
		for(var i = 0; i < passedArguments.length; i++) {
			// If we have an instance of an Error object
			if(passedArguments[i] && passedArguments[i].isError()) {
				message += "\n"+Json.indent(passedArguments[i].toObject(true));
			}
			// If we have an non-string object encode it into Json and indent it
			else if(passedArguments[i] && !String.is(passedArguments[i]) && Object.is(passedArguments[i])) {
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
		var lineNumber = error.stack.callSites.first().getLineNumber();
		var columnNumber = error.stack.callSites.first().getColumnNumber();
		var fileName = error.stack.callSites.first().getFileName();
		if(fileName) {
			fileName = fileName.split('/').reverse()[0];
		}

	    //console.log('Line Number'+': '+lineNumber);
	    //console.log('Column Number'+': '+columnNumber);
	    //console.log('File Name'+': '+fileName);

	    message = '['+new Time().getDateTime()+'] ('+fileName+':'+lineNumber+') '+message;

	    return message;
	},

	listen: function() {
		if(global['NodeStandardIn']) {
			//NodeStandardIn.setRawMode(true); // Takes input character by character
			NodeStandardIn.resume();
			NodeStandardIn.setEncoding('utf8');
			NodeStandardIn.on('data', function(data) {
				this.handleCommand(data);
			}.bind(this));	
		}
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