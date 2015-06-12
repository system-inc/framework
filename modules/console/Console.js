ConsoleClass = Class.extend({

	identifier: null,
	log: null,
	showTime: true,
	showFile: true,

	commandHistoryFile: null,
	commandHistory: [],
	currentCommandHistoryIndex: -1,
	currentCommandString: '',
	currentCommandCursorIndex: 0,
	commandColor: 'cyan',

	construct: function(identifier) {
		this.identifier = (identifier === undefined ? this.identifier : identifier);

		// Listen for incoming commands from standard in
		this.listen();
	},

	write: function(message) {
		// If we have StandardIn
		if(Node.StandardIn) {
			// Write the message to standard out
			Node.StandardOut.write(message);
		}
		// If we do not have StandardIn (we are in a browser or other context)
		else {
			// Use the console
			console.log(message);
		}
		
		// If we have a log, write the message to it
		if(this.log) {
			this.log.write(message+"\n");
		}
	},

	logInBrowser: function() {
		var index = -1;
		var argumentsLength = arguments.length;
		var argumentsClone = [];
		var consoleLogFunction = 'console.log(argumentsClone)';

		while(++index < argumentsLength) {
			argumentsClone.push('argumentsClone['+index+']');
		};

		consoleLogFunction = new Function('argumentsClone', consoleLogFunction.replace(/argumentsClone/,argumentsClone.join(',')));
		consoleLogFunction(arguments);
	},

	out: function() {
		// If we are using the Electron module
		// TODO: find a better way to do this
		if(global.Electron) {
			this.logInBrowser.apply(this, arguments);	
		}

		// Prepare the message
		var message = Console.prepareMessage(arguments);
		//console.log.apply(this, arguments); // This invokes the stock console.log method

		this.write(message+"\n");

		return message;
	},

	highlight: function() {
		// Prepare the message
		var message = Console.prepareMessage(arguments);

		// Wrap the message in ASCII
		message = Terminal.style("\n\n                                                |>>>\r\n                                                |\r\n                                            _  _|_  _\r\n                                           |;|_|;|_|;|\r\n                                           \\\\.    .  \/\r\n                                            \\\\:  .  \/\r\n                                             ||:   |\r\n                                             ||:.  |\r\n                                             ||:  .|\r\n                                             ||:   |       \\,\/\r\n                                             ||: , |            \/`\\\r\n                                             ||:   |\r\n                                             ||: . |\r\n              __                            _||_   |\r\n     ____--`~    \'--~~__            __ ----~    ~`---,              ___\r\n-~--~                   ~---__ ,--~\'                  ~~----_____-~\'   `~----~~\n\n\n\n", 'gray')+Terminal.style(message+"\n\n", 'green');

		this.write(message);
	},

	attachLog: function(directory) {
		this.log = new Log(directory, this.identifier);
	},

	loadCommandHistory: function*(directory, fileNameWithoutExtension) {
		//Console.out('Loading history...', directory, fileNameWithoutExtension);

		// Make sure the directory exists
		var directoryExists = yield Directory.exists(directory);
		if(!directoryExists) {
			yield Directory.create(directory);
		}

		var file = directory+fileNameWithoutExtension+'.log';

		var commandHistory;
		if(File.synchronous.exists(file)) {
			commandHistory = File.synchronous.read(file);
		}
		//Console.out(commandHistory);

		if(!commandHistory) {
			//Console.out('No history found.');
			this.commandHistory = [];
		}
		else {
			//Console.out(commandHistory.toString());
			commandHistory.toString().split("\n").each(function(index, string) {
				if(string) {
					this.commandHistory.prepend(string);
				}
			}.bind(this));
		}

		//Console.out('this.commandHistory', this.commandHistory);

		this.commandHistoryFile = new File(file);

		//Console.out('this.commandHistoryFile', this.commandHistoryFile);

		yield this.commandHistoryFile.open('a+');
	},

	prepareMessage: function(passedArguments) {
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

	    //console.log('Line Number'+': '+lineNumber);
	    //console.log('Column Number'+': '+columnNumber);
	    //console.log('File Name'+': '+fileName);

	    if(this.showFile) {
	    	message = '('+fileName+':'+lineNumber+') '+message;
	    }

	    if(this.showTime) {
	    	message = '['+new Time().getDateTime()+'] '+message;
	    }

	    return message;
	},

	listen: function() {
		// Make sure we have Node.StandardIn
		if(global['Node'] && global['Node'].StandardIn) {
			if(Node.StandardIn.setRawMode) {
				Node.StandardIn.setRawMode(true); // Takes input character by character	
			}
			Node.StandardIn.resume();
			Node.StandardIn.setEncoding('utf8');
			Node.StandardIn.on('data', function(key) {
				this.handleKey(key);
			}.bind(this));
		}
	},

	handleKey: function(key) {
		// Ctrl-c
		if(key == '\u0003') {
			Node.exit();
		}
		// Up
		else if(key == '\u001b[A') {
			//Console.out('up');

			if(this.currentCommandHistoryIndex < this.commandHistory.length - 1) {
				this.currentCommandHistoryIndex++;
			}

			//Console.out(this.currentCommandHistoryIndex, this.commandHistory);

			if(this.commandHistory[this.currentCommandHistoryIndex] !== undefined) {
				this.currentCommandString = this.commandHistory[this.currentCommandHistoryIndex];	
			}

			// Clear the line
			Terminal.clearLine();

			// Move to the beginning of the line
			var moveLeft = 0;
			if(this.currentCommandCursorIndex > 0) {
				moveLeft = this.currentCommandCursorIndex;
			}
			Terminal.cursorLeft(moveLeft);

			this.currentCommandCursorIndex = this.currentCommandString.length;

			// Write the current string (this moves the cursor right)
			Console.write(this.currentCommandString);
		}
		// Down
		else if(key == '\u001b[B') {
			//Console.out('down');

			if(this.currentCommandHistoryIndex > -1) {
				this.currentCommandHistoryIndex--;
			}

			//Console.out(this.currentCommandHistoryIndex, this.commandHistory);

			if(this.currentCommandHistoryIndex == -1) {
				this.currentCommandString = '';
			}
			else if(this.commandHistory[this.currentCommandHistoryIndex] !== undefined) {
				this.currentCommandString = this.commandHistory[this.currentCommandHistoryIndex];	
			}

			// Clear the line
			Terminal.clearLine();

			// Move to the beginning of the line
			var moveLeft = 0;
			if(this.currentCommandCursorIndex > 0) {
				moveLeft = this.currentCommandCursorIndex;
			}
			Terminal.cursorLeft(moveLeft);

			this.currentCommandCursorIndex = this.currentCommandString.length;

			// Write the current string (this moves the cursor right)
			Console.write(this.currentCommandString);
		}
		// Left
		else if(key == '\u001b[D') {
			if(this.currentCommandCursorIndex == 0) {
				Terminal.beep();
			}
			else {
				this.currentCommandCursorIndex--;
				Terminal.cursorLeft();
			}
		}
		// Right
		else if(key == '\u001b[C') {
			if(this.currentCommandCursorIndex == this.currentCommandString.length) {
				Terminal.beep();
			}
			else {
				this.currentCommandCursorIndex++;
				Terminal.cursorRight();
			}
		}
		// Home
		else if(key == '\u001b[1~') {
			// Move to the beginning of the line
			var moveLeft = 0;
			if(this.currentCommandCursorIndex > 0) {
				moveLeft = this.currentCommandCursorIndex;
			}
			Terminal.cursorLeft(moveLeft);

			this.currentCommandCursorIndex = 0;
		}
		// End
		else if(key == '\u001b[4~') {
			// Move to the end of the line
			var moveRight = 0;
			if(this.currentCommandCursorIndex < this.currentCommandString.length) {
				moveRight = this.currentCommandString.length - this.currentCommandCursorIndex;
			}
			Terminal.cursorRight(moveRight);

			this.currentCommandCursorIndex = this.currentCommandString.length;
		}
		// Tab
		else if(key == "\t") {
			var rightCount = this.currentCommandString.length - this.currentCommandCursorIndex;
			this.currentCommandCursorIndex = this.currentCommandString.length;
			Terminal.cursorRight(rightCount);

			this.assistCommand(this.currentCommandString);
		}
		// Enter
		else if(key == "\n" || key == "\r") {
			if(this.currentCommandString) {
				// Don't stack multiple of the same commands
				if(this.currentCommandString != this.commandHistory.first()) {
					this.commandHistory.unshift(this.currentCommandString);
				}
				
				this.currentCommandHistoryIndex = -1;

				// Write the history to disk
				if(this.commandHistoryFile) {
					this.commandHistoryFile.write(this.currentCommandString+"\n");
				}
			}

			//Console.out('enter');
			this.handleCommand(this.currentCommandString);
			this.currentCommandString = '';
			this.currentCommandCursorIndex = 0;
		}
		// Backspace
		else if(key.charCodeAt(0) === 127 || key.charCodeAt(0) == 8) {
			// Remove the character prior to the cursor
			this.currentCommandString = this.currentCommandString.substring(0, this.currentCommandCursorIndex - 1)+this.currentCommandString.substring(this.currentCommandCursorIndex);

			// Move the cursor index back one
			if(this.currentCommandCursorIndex > 0) {
				this.currentCommandCursorIndex--;
			}

			// Clear the line
			Terminal.clearLine();

			// Move the cursor to the beginning of the line
			Terminal.cursorLeft(this.currentCommandCursorIndex + 1);
			
			// Write the new string, this moves the cursor right
			Console.write(this.currentCommandString);

			// Move back to where the cursor should be
			Terminal.cursorLeft(this.currentCommandString.length - this.currentCommandCursorIndex);
		}
		// Delete
		else if(key == '\u001b[3~') {
			// Remove the character the cursor is on
			this.currentCommandString = this.currentCommandString.substring(0, this.currentCommandCursorIndex)+this.currentCommandString.substring(this.currentCommandCursorIndex + 1);

			// Clear the line
			Terminal.clearLine();

			// Move the cursor to the beginning of the line
			Terminal.cursorLeft(this.currentCommandCursorIndex);
			
			// Write the new string, this moves the cursor right
			Console.write(this.currentCommandString);

			// Move back to where the cursor should be
			Terminal.cursorLeft(this.currentCommandString.length - this.currentCommandCursorIndex);
		}
		// Any other key
		else {
			//Console.out(key);
			//Console.out(key.charCodeAt(0));
			this.currentCommandString = this.currentCommandString.insert(this.currentCommandCursorIndex, key);
			this.currentCommandCursorIndex += key.length;

			// Clear the line
			Terminal.clearLine();

			// Move to the beginning of the line
			Terminal.cursorLeft(this.currentCommandCursorIndex - 1);

			// Write the current string (this moves the cursor right)
			Console.write(this.currentCommandString);

			// Move back to where the cursor should be
			Terminal.cursorLeft(this.currentCommandString.length - this.currentCommandCursorIndex);
		}
	},

	assistCommand: function(command) {
		command = command.trim();

		// The thing we are going to print out
		var response;

		// Get the current context
		var variableArray = command.split('.');

		// The fragment of the command
		var commandFragment = variableArray.pop();

		// The context of the command
		var context = undefined;
		var parentContext = global;

		// Find the context
		var current = global;
		variableArray.each(function(index, variable) {
			if(current[variable] !== undefined) {
				parentContext = current;
				current = current[variable];
			}
			else {
				return false; // break
			}
		});
		context = current;

		// If the context is still global, do some more work to see if we are working with a command that is not an object path
		if(context === global && command.endsWith('.')) {
			context = undefined;

			// Try to eval the statement and get an object back to get context
			var commandToEval = command;
			if(commandToEval.endsWith('.')) {
				commandToEval = commandToEval.replaceLast('.', '');
			}

			// Try to run the command as is (without a trailing period)
			try {
				context = eval(commandToEval);
				//Console.out('got context!', command, commandToEval);
			}
			catch(error) {
				context = undefined;
			}

			// If we got nothing, try to run the command prior to the last fragment
			if(context === undefined) {
				try {
					commandToEval = variableArray.join('.');
					context = eval(commandToEval);
					//Console.out('got context!', command, commandToEval);
				}
				catch(error) {
					context = undefined;
				}
			}
		}

		// If we still have no context then just use global as the context
		if(context === undefined) {
			context = global;
		}
		
		// See if the command fragment exists in the context
		var commandMatch = (context[commandFragment] !== undefined);

		// Get all of the available commands for the context
		var availableCommandArray = [];
		var availableFunctionsArray = [];
		var availablePropertiesArray = [];
		for(var key in context) {
			if(Function.is(context[key])) {
				availableFunctionsArray.push(key+'()');
			}
			else {
				availablePropertiesArray.push(key);
			}
		}
		availableCommandArray = availablePropertiesArray.sort().concatenate(availableFunctionsArray.sort());
		//Console.out(availableCommandArray);

		// Find all of the commands that potentially match
		var partialMatchArray = [];
		availableCommandArray.each(function(index, key) {
			if(key.startsWith(commandFragment)) {
				partialMatchArray.push(key);
			}
		});
		
		// Command matches and is the only match
		if(commandMatch && partialMatchArray.length == 1) {
			// Add a period
			if(!command.endsWith('.')) {
				this.currentCommandCursorIndex++;
				this.currentCommandString += '.';
				Console.write('.');
			}

			// Nothing happens
			return;
		}
		// Exact match, there are potentially longer matches
		else if(commandMatch && partialMatchArray.length > 1) {
			response = partialMatchArray;
		}
		// No exact matches, there are potential matches
		else if(!commandMatch && partialMatchArray.length > 0) {
			// Sort the partial match array by length
			var sortedPartialMatchArray = partialMatchArray.clone().sortByLength();

			// Print out characters to where all possible matches meet up
			var currentPartialMatchCharacterIndex = commandFragment.length;
			var maximumPartialMatchCharacterIndex = sortedPartialMatchArray.first().length;
			var charactersWritten = 0;

			for(var i = currentPartialMatchCharacterIndex; i < maximumPartialMatchCharacterIndex; i++) {
				var currentCharacterToTest = sortedPartialMatchArray.first()[i];
				var currentCharacterToTestMatches = true;
				sortedPartialMatchArray.each(function(index, partialMatch) {
					if(partialMatch[i] != currentCharacterToTest) {
						currentCharacterToTestMatches = false;
						return false;
					}
				});

				if(currentCharacterToTestMatches) {
					charactersWritten++;
					this.currentCommandCursorIndex++;
					this.currentCommandString += currentCharacterToTest;
					Console.write(currentCharacterToTest);
				}
				else {
					break;
				}
			}

			if(!charactersWritten) {
				response = partialMatchArray;
			}
			else {
				return;	
			}
		}
		// No matches
		else {
			if(partialMatchArray.length > 0) {
				response = partialMatchArray;
			}
			//if(context) {
			//	// Add a period
			//	if(!command.endsWith('.')) {
			//		this.currentCommandCursorIndex++;
			//		this.currentCommandString += '.';
			//		Console.write('.');
			//	}

			//	return;
			//}
			else {
				// Show nothing
				Terminal.beep();
				return;
			}
		}

		if(response) {
			Console.showTime = false;
			Console.showFile = false;
			Console.out("\n"+Terminal.style("\n"+'   '+response.join("\n   ")+"\n", this.commandColor));
			Console.showTime = true;
			Console.showFile = true;
		}

		this.currentCommandCursorIndex = this.currentCommandString.length;
		this.currentCommandString = command;
		Terminal.clearLine();
		Terminal.cursorLeft(this.currentCommandString.length + 1);
		Console.write(this.currentCommandString);
	},

	handleCommand: function(command) {
		command = command.trim();

		// Strip any trailing periods
		if(command.endsWith('.')) {
			command = command.substring(0, command.length - 1);
		}

		//Console.out('Command:', command);

		var response;

		if(global[command] !== undefined) {
			response = global[command];
		}
		else if(command.lowercase() == 'hi') {
			response = 'Hello.';
		}
		else if(command.lowercase() == 'hello') {
			response = 'Hi.';
		}
		else if(command.lowercase() == 'clear' || command.lowercase() == 'cls') {
			Terminal.clear();
			return;
		}
		else {
			try {
				response = eval(command);
			}
			catch(error) {
				response = error;
			}
		}

		Console.showTime = false;
		Console.showFile = false;

		if(Generator.is(response)) {
			Console.out("\n"+Terminal.style(Console.prepareMessage.call(this, ['function '+command+'*() { ... }']), this.commandColor));	
		}
		else if(Function.is(response)) {
			Console.out("\n"+Terminal.style(Console.prepareMessage.call(this, ['function '+command+'() { ... }']), this.commandColor));	
		}
		else if(Promise.is(response)) {
			Console.out("\n"+Terminal.style(Console.prepareMessage.call(this, [response]), this.commandColor));	

			response.then(function() {
				Console.showTime = false;
				Console.showFile = false;
				Console.out(Terminal.style(Console.prepareMessage.call(this, ['Promise completed:']), this.commandColor));	
				Console.out(Terminal.style(Console.prepareMessage.call(this, arguments), this.commandColor));	
				Console.showTime = true;
				Console.showFile = true;
			}.bind(this));
		}
		else if(!command.isEmpty()) {
			Console.out("\n"+Terminal.style(Console.prepareMessage.call(this, [response]), this.commandColor));	
		}
		else {
			Console.write("\n");
		}
		
		Console.showTime = true;
		Console.showFile = true;

		return;
	},

});

// Instantiate a global console
Console = new ConsoleClass('console');