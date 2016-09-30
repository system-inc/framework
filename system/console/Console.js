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