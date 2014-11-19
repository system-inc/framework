ConsoleClass = Class.extend({

	identifier: null,
	log: null,
	showTime: true,
	showFile: true,

	commandHistory: [],
	currentCommandHistoryIndex: 0,
	currentCommandString: '',

	construct: function(identifier) {
		this.identifier = (identifier === undefined ? this.identifier : identifier);

		// Listen for incoming commands from standard in
		this.listen();
	},

	write: function(message) {
		// If we are not in the browser
		if(Node.StandardIn) {
			// Write the message to standard out
			Node.StandardOut.write(message);
		}
		else {
			// Use the console
			console.log(message);
		}
		
		// If we have a log, write the message to it
		if(this.log) {
			this.log.write(message+"\n");
		}
	},

	out: function() {
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

	prepareMessage: function(passedArguments) {
		var message = '';

		// Build the message
		for(var i = 0; i < passedArguments.length; i++) {
			// If we have an instance of an Error object
			if(passedArguments[i] && Error.is(passedArguments[i])) {
				message += Json.indent(passedArguments[i].toObject(true));
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
			fileName = fileName.split('/').reverse()[0];
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
		if(global['Node'] && global['Node']['StandardIn']) {
			Node.StandardIn.setRawMode(true); // Takes input character by character
			Node.StandardIn.resume();
			Node.StandardIn.setEncoding('utf8');
			Node.StandardIn.on('data', function(key) {
				this.handleKey(key);
			}.bind(this));
		}
	},

	handleKey: function(key) {
		
		// ctrl-c
		if(key == '\u0003') {
			Node.Process.exit(0);
		}
		// up
		else if(key == '\u001b[A') {
			Console.out('up');
		}
		// down
		else if(key == '\u001b[B') {
			Console.out('down');
		}
		// left
		else if(key == '\u001b[D') {
			Terminal.cursorLeft();
			//Console.out('left');
		}
		// right
		else if(key == '\u001b[C') {
			Terminal.cursorRight();
			//Console.out('right');
		}
		// tab
		else if(key == "\t") {
			//Console.out('tab');
			this.assistCommand(this.currentCommandString);
		}
		// enter
		else if(key == "\n" || key == "\r") {
			//Console.out('enter');
			this.handleCommand(this.currentCommandString);
			this.currentCommandString = '';
		}
		// backspace
		else if(key.charCodeAt(0) === 127) {
			// Remove the last character
			this.currentCommandString = this.currentCommandString.substring(0, this.currentCommandString.length - 1);
			Console.write(key);
		}
		// anything else
		else {
			this.currentCommandString += key;
			Console.write(key);
		}

		//this.handleCommand(data);
	},

	assistCommand: function(command) {
		command = command.trim();

		// The thing we are going to print out
		var response;

		// Get the current context
		var variableArray = command.split('.');

		// The fragment of the command
		var commandFragment = variableArray.pop();

		// Find the context
		if(variableArray.length > 0) {
			var current = global;
			variableArray.each(function(index, variable) {
				if(current[variable] !== undefined) {
					current = current[variable];
				}
				else {
					return false; // break
				}
			});
			context = current;
		}
		// If there are no "."'s then the context is global
		else {
			context = global;
		}
		
		// See if the command fragment exists in the context
		var commandMatch = (context[commandFragment] !== undefined);

		// Get all of the available commands for the context
		var availableCommandArray = Object.keys(context);

		// Find all of the commands that potentially match
		var partialMatchArray = [];
		availableCommandArray.each(function(index, key) {
			if(key.startsWith(commandFragment)) {
				partialMatchArray.push(key);
			}
		});

		// Sort the partial match array
		partialMatchArray.sort();
		
		// Command matches and is the only match
		if(commandMatch && partialMatchArray.length == 1) {
			// Add a period
			if(!command.endsWith('.')) {
				Console.write('.');
				this.currentCommandString += '.';
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
			partialMatchArray.sortByLength();

			// Print out characters to where all possible matches meet up
			var currentPartialMatchCharacterIndex = commandFragment.length;
			var maximumPartialMatchCharacterIndex = partialMatchArray.first().length;
			var charactersWritten = 0;

			for(var i = currentPartialMatchCharacterIndex; i < maximumPartialMatchCharacterIndex; i++) {
				var currentCharacterToTest = partialMatchArray.first()[i];
				var currentCharacterToTestMatches = true;
				partialMatchArray.each(function(index, partialMatch) {
					if(partialMatch[i] != currentCharacterToTest) {
						currentCharacterToTestMatches = false;
						return false;
					}
				});

				if(currentCharacterToTestMatches) {
					charactersWritten++;
					Console.write(currentCharacterToTest);
					this.currentCommandString += currentCharacterToTest;
				}
				else {
					break;
				}
			}

			if(!charactersWritten) {
				response = partialMatchArray.sort();
			}
			else {
				return;	
			}
		}
		// No matches
		else {
			// Show nothing
		}

		if(response) {
			Console.showTime = false;
			Console.showFile = false;
			Console.out("\n"+Terminal.style(Console.prepareMessage.call(this, [response]), 'cyan'));
			Console.showTime = true;
			Console.showFile = true;
		}

		this.currentCommandString = command;
		Terminal.clearLine();
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

		if(Function.is(response)) {
			Console.out("\n"+Terminal.style(Console.prepareMessage.call(this, ['function '+command+'() { ... }']), 'cyan'));	
		}
		else if(!command.isEmpty()) {
			Console.out("\n"+Terminal.style(Console.prepareMessage.call(this, [response]), 'cyan'));	
		}
		
		Console.showTime = true;
		Console.showFile = true;

		return;
	},

});

// Instantiate a global console
Console = new ConsoleClass('console');