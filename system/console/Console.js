// Dependencies
var Terminal = require('./Terminal.js');

// Class
var Console = console;

// Static properties

// Keep a reference to the standard console methods
Console.standardLog = app.log;
Console.standardInfo = app.info;
Console.standardWarn = app.warn;
Console.standardError = Console.error;

// Session for logging
Console.session = null;

// Where the console is reading from and writing to
Console.location = (process && process.versions && process.versions.electron) ? 'developerTools' : 'terminal';

// Static methods

Console.onTerminal = function() {
	return Console.location == 'terminal';
};

Console.onDeveloperTools = function() {
	return Console.location == 'developerTools';
};

app.log = function() {
	if(Console.onDeveloperTools()) {
		Console.writeToDeveloperTools(arguments, 'log');
	}
	else {
		Console.writeToTerminal(Console.prepareMessage(arguments)+"\n");
	}
};

app.info = function() {
	if(Console.onDeveloperTools()) {
		Console.writeToDeveloperTools(arguments, 'info');
	}
	else {
		Console.writeToTerminal(Console.prepareMessage(arguments, 'info')+"\n");
	}
};

app.warn = function() {
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
		Console.standardLog.call(this, Console.prepareMessage(passedArguments, messageType, true));
	}
	else if(messageType == 'info') {
		Console.standardInfo.call(this, Console.prepareMessage(passedArguments, messageType, true));
	}
	else if(messageType == 'warn') {
		Console.standardWarn.call(this, Console.prepareMessage(passedArguments, messageType, true));
	}
	else if(messageType == 'error') {
		Console.standardError.call(this, Console.prepareMessage(passedArguments, messageType, true));
	}
	else if(messageType == 'highlight') {
		var highlight = "%c\n\n                                                |>>>\r\n                                                |\r\n                                            _  _|_  _\r\n                                           |;|_|;|_|;|\r\n                                           \\\\.    .  \/\r\n                                            \\\\:  .  \/\r\n                                             ||:   |\r\n                                             ||:.  |\r\n                                             ||:  .|\r\n                                             ||:   |       \\,\/\r\n                                             ||: , |            \/`\\\r\n                                             ||:   |\r\n                                             ||: . |\r\n              __                            _||_   |\r\n     ____--`~    \'--~~__            __ ----~    ~`---,              ___\r\n-~--~                   ~---__ ,--~\'                  ~~----_____-~\'   `~----~~\n\n\n\n";
		Console.standardLog.call(this, highlight, 'color: #CCC');
		Console.standardLog.call(this, Console.prepareMessage(passedArguments, messageType, true));
	}

	// Write to ConsoleSession
	Console.writeToSession(Console.prepareMessage(passedArguments, messageType));

	// For logging, always write a newline to the session (developer tools display always uses newlines)
	Console.writeToSession("\n");
};

Console.writeToTerminal = function(message, shouldWriteToSession) {
	// shouldWriteToSession defaults to true
	if(shouldWriteToSession === undefined) {
		shouldWriteToSession = true;
	}

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
	if(shouldWriteToSession) {
		Console.writeToSession(message);
	}
};

Console.writeToSession = function(message) {
	if(Console.session) {
		Console.session.write(message);
	}
};

Console.prepareMessage = function(passedArguments, messageType, removeAnsiEscapeCodesFromString) {
	// messageType defaults to normal
	if(messageType === undefined) {
		messageType = 'normal';
	}

	// removeAnsiEscapeCodesFromString defaults to false
	if(removeAnsiEscapeCodesFromString === undefined) {
		removeAnsiEscapeCodesFromString = false;
	}

	var message = '';

	// Build the message
	for(var i = 0; i < passedArguments.length; i++) {
		// If we have a function
		if(passedArguments[i] && Function.is(passedArguments[i])) {
			message += Node.Utility.inspect(passedArguments[i], {
				'showHidden': true,
				'depth': 2,
				'colors': true,
			});
		}
		// If we have an error
		else if(passedArguments[i] && Error.is(passedArguments[i])) {
			// Use StackTrace.toString() and style it red
			message += Terminal.style(passedArguments[i].stack, 'red');
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

	// Show extra data on all messages except for those of messageType 'write'
	if(messageType != 'write') {
		// Create a new error
		var error = new Error('Error manually created to get stack trace.');

		// Capture the stack trace from the callee
	    Error.captureStackTrace(error, passedArguments.callee);

	    // Get the location data of the first call site
	    var callSiteData = error.stack.getCallSite(0);

    	message = '('+callSiteData.fileName+':'+callSiteData.lineNumber+') '+message;
    	message = '['+new Time().getDateTime()+'] '+message;
    }

    // Style message types
    if(removeAnsiEscapeCodesFromString) {
    	message = Terminal.removeAnsiEscapeCodesFromString(message);
    }
    else {
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
    }

    return message;
};

// Export
module.exports = Console;