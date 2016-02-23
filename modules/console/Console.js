// Dependencies
var Terminal = require('./Terminal.js');

// Class
var Console = console;

// Static properties

// Keep a reference to the standard console methods
Console.standardLog = Console.log;
Console.standardInfo = Console.info;
Console.standardWarn = Console.warn;
Console.standardError = Console.error;

// Session for logging
Console.session = null;

// Display options
Console.showTime = true;
Console.showFile = true;

// Where the console is reading from and writing to
Console.location = (process && process.versions && process.versions.electron) ? 'developerTools' : 'terminal';

// Static methods

Console.onTerminal = function() {
	return Console.location == 'terminal';
};

Console.onDeveloperTools = function() {
	return Console.location == 'developerTools';
};

Console.log = function() {
	if(Console.onDeveloperTools()) {
		Console.writeToDeveloperTools(arguments, 'log');
	}
	else {
		Console.writeToTerminal(Console.prepareMessage(arguments)+"\n");
	}
};

Console.info = function() {
	if(Console.onDeveloperTools()) {
		Console.writeToDeveloperTools(arguments, 'info');
	}
	else {
		Console.writeToTerminal(Console.prepareMessage(arguments, 'info')+"\n");
	}
};

Console.warn = function() {
	if(Console.onDeveloperTools()) {
		Console.writeToDeveloperTools(arguments, 'warn');
	}
	else {
		Console.writeToTerminal(Console.prepareMessage(arguments, 'warn')+"\n");
	}
};

Console.error = function() {
	if(Console.onDeveloperTools()) {
		Console.writeToDeveloperTools(arguments, 'error');
	}
	else {
		Console.writeToTerminal(Console.prepareMessage(arguments, 'error')+"\n");
	}
};

Console.highlight = function() {
	if(Console.onDeveloperTools()) {
		Console.writeToDeveloperTools(arguments, 'highlight');
	}
	else {
		Console.writeToTerminal(Console.prepareMessage(arguments, 'highlight')+"\n");
	}
};

// Does not show the file or time
Console.write = function() {
	if(Console.onDeveloperTools()) {
		Console.writeToDeveloperTools(arguments, 'write');
	}
	else {
		Console.writeToTerminal(Console.prepareMessage(arguments, 'write'));
	}
};

Console.writeLine = function() {
	if(Console.onDeveloperTools()) {
		Console.writeToDeveloperTools(arguments, 'write');
	}
	else {
		Console.writeToTerminal(Console.prepareMessage(arguments, 'write')+"\n");
	}
};

Console.writeToDeveloperTools = function(passedArguments, messageType) {
	if(!messageType) {
		messageType = 'log';
	}

	if(messageType == 'log' || messageType == 'write') {
		Console.standardLog.apply(this, passedArguments);
	}
	else if(messageType == 'info') {
		Console.standardInfo.apply(this, passedArguments);
	}
	else if(messageType == 'warn') {
		Console.standardWarn.apply(this, passedArguments);
	}
	else if(messageType == 'error') {
		Console.standardError.apply(this, passedArguments);
	}
	else if(messageType == 'highlight') {
		Console.standardLog("%c\n\n                                                |>>>\r\n                                                |\r\n                                            _  _|_  _\r\n                                           |;|_|;|_|;|\r\n                                           \\\\.    .  \/\r\n                                            \\\\:  .  \/\r\n                                             ||:   |\r\n                                             ||:.  |\r\n                                             ||:  .|\r\n                                             ||:   |       \\,\/\r\n                                             ||: , |            \/`\\\r\n                                             ||:   |\r\n                                             ||: . |\r\n              __                            _||_   |\r\n     ____--`~    \'--~~__            __ ----~    ~`---,              ___\r\n-~--~                   ~---__ ,--~\'                  ~~----_____-~\'   `~----~~\n\n\n\n", 'color: #CCC');
		Console.standardLog.apply(this, passedArguments);
	}

	// Write to ConsoleSession
	if(messageType == 'write') {
		Console.writeToSession(passedArguments);	
	}
	else {
		Console.writeToSession(Console.prepareMessage(passedArguments, messageType));
	}
};

Console.writeToTerminal = function(message) {
	// Try to write to standard out
	try {
		// Write the message to standard out
		Node.StandardOut.write(message);
	}
	// If we can't write to standard out
	catch(exception) {
		Console.standardError('Exception on Node.StandardOut.write', exception);
		Console.standardError(message);
	}

	// Write to ConsoleSession
	Console.writeToSession(message);
};

Console.writeToSession = function(message) {
	if(Console.session) {
		Console.session.write(message);
	}
};

Console.prepareMessage = function(passedArguments, messageType) {
	if(messageType === undefined) {
		messageType = 'normal';
	}

	var message = '';

	// Build the message
	for(var i = 0; i < passedArguments.length; i++) {
		// If we have an instance of an Error object
		if(passedArguments[i] && Error.is(passedArguments[i])) {
			message += Json.indent(passedArguments[i].toObject(true));
		}
		// If we have a function
		else if(passedArguments[i] && Function.is(passedArguments[i])) {
			message += Node.Utility.inspect(passedArguments[i], {
				'showHidden': true,
				'depth': 2,
				'colors': true,
			});
		}
		// If we have an non-primitive encode it into Json and indent it
		else if(passedArguments[i] && !Primitive.is(passedArguments[i])) {
			message += Json.indent(passedArguments[i]);
		}
		else {
			message += passedArguments[i];	
		}			

		if(i != (passedArguments.length - 1)) {
			message += ' ';
		}
	}

	// Messages with messageType 'write' do not show extra data
	if(messageType != 'write') {
		// Create a new error
		var error = new Error('Error manually created to get stack trace.');

		// Capture the stack trace from the callee
	    Error.captureStackTrace(error, passedArguments.callee);

	    // Format the stack trace
		var lineNumber = error.stack.callSites.first().getLineNumber();
		var columnNumber = error.stack.callSites.first().getColumnNumber();
		var fileName = error.stack.callSites.first().getFileName();
		if(fileName) {
			fileName = fileName.split(Node.Path.separator).reverse()[0];
		}

	    //Console.log('Line Number'+': '+lineNumber);
	    //Console.log('Column Number'+': '+columnNumber);
	    //Console.log('File Name'+': '+fileName);

	    if(Console.showFile) {
	    	message = '('+fileName+':'+lineNumber+') '+message;
	    }

	    if(Console.showTime) {
	    	message = '['+new Time().getDateTime()+'] '+message;
	    }
    }

    // Style message types
    if(messageType == 'info') {
    	message = Terminal.style(message, 'cyan');
    }
    else if(messageType == 'warn') {
    	message = Terminal.style(message, 'yellow');
    }
    else if(messageType == 'error') {
    	message = Terminal.style(message, 'red');
    }
    else if(messageType == 'highlight') {
    	// Wrap the message in ASCII
		message = Terminal.style("\n\n                                                |>>>\r\n                                                |\r\n                                            _  _|_  _\r\n                                           |;|_|;|_|;|\r\n                                           \\\\.    .  \/\r\n                                            \\\\:  .  \/\r\n                                             ||:   |\r\n                                             ||:.  |\r\n                                             ||:  .|\r\n                                             ||:   |       \\,\/\r\n                                             ||: , |            \/`\\\r\n                                             ||:   |\r\n                                             ||: . |\r\n              __                            _||_   |\r\n     ____--`~    \'--~~__            __ ----~    ~`---,              ___\r\n-~--~                   ~---__ ,--~\'                  ~~----_____-~\'   `~----~~\n\n\n\n", 'gray')+Terminal.style(message+"\n\n", 'green');
    }

    return message;
};

// Export
module.exports = Console;