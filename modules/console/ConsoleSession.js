// Dependencies
var Log = Framework.require('modules/log/Log.js');
var File = Framework.require('modules/file-system/File.js');
var Directory = Framework.require('modules/file-system/Directory.js');
var Terminal = Framework.require('modules/console/Terminal.js');

// Class
var ConsoleSession = Class.extend({

	// Log
	log: null,

	// Command history
	commandHistoryFile: null,
	commandHistory: [],
	currentCommandHistoryIndex: -1,
	currentCommandString: '',
	currentCommandCursorIndex: 0,
	commandColor : 'cyan',

	construct: function() {
		this.listen();
	},

	// Listen for incoming commands from standard in
	listen: function() {
		// If the Console is on a terminal
		if(Console.onTerminal()) {
			if(Node.StandardIn.setRawMode) {
				Node.StandardIn.setRawMode(true); // Takes input character by character	
			}
			Node.StandardIn.resume();
			Node.StandardIn.setEncoding('utf8');
			Node.StandardIn.on('data', function(key) {
				//console.log('key', key);
				this.handleKey(key);
			}.bind(this));
		}
	},

	write: function(message) {
		if(this.log) {
			this.log.write(Terminal.removeAnsiEscapeCodesFromString(message));
		}
	},

	attachLog: function(directory) {
		this.log = new Log(directory, 'console');

		this.write("\n"+'['+new Time().getDateTime()+'] Attached log to console session. Console activity is recorded to "'+this.log.file.path+'".'+"\n");
	},

	loadCommandHistory: function*(directory, fileNameWithoutExtension) {
		//Console.log('Loading history...', directory, fileNameWithoutExtension);

		// Make sure the directory exists
		var directoryExists = yield Directory.exists(directory);
		if(!directoryExists) {
			yield Directory.create(directory);
		}

		var file = Node.Path.join(directory, fileNameWithoutExtension+'.log');

		var commandHistory;
		if(File.synchronous.exists(file)) {
			commandHistory = File.synchronous.read(file);
		}
		//Console.log('commandHistory', commandHistory);

		if(!commandHistory) {
			//Console.log('No history found.');
			this.commandHistory = [];
		}
		else {
			//Console.log(commandHistory.toString());
			commandHistory.toString().split("\n").each(function(index, string) {
				if(string) {
					this.commandHistory.prepend(string);
				}
			}.bind(this));
		}

		//Console.log('this.commandHistory', this.commandHistory);

		this.commandHistoryFile = new File(file);

		//Console.log('this.commandHistoryFile', this.commandHistoryFile);

		yield this.commandHistoryFile.open('a+');
	},

	handleKey: function(key) {
		// Ctrl-c
		if(key == '\u0003') {
			Node.exit();
		}
		// Up
		else if(key == '\u001b[A') {
			//Console.log('up', 'this.currentCommandHistoryIndex', this.currentCommandHistoryIndex);

			if(this.currentCommandHistoryIndex < this.commandHistory.length - 1) {
				this.currentCommandHistoryIndex++;
			}

			//Console.log(this.currentCommandHistoryIndex, this.commandHistory);

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
			Console.writeToTerminal(this.currentCommandString, false);
		}
		// Down
		else if(key == '\u001b[B') {
			//Console.log('down', 'this.currentCommandHistoryIndex', this.currentCommandHistoryIndex);

			if(this.currentCommandHistoryIndex > -1) {
				this.currentCommandHistoryIndex--;
			}

			//Console.log(this.currentCommandHistoryIndex, this.commandHistory);

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
			Console.writeToTerminal(this.currentCommandString, false);
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
				var shouldAddCurrentCommandToCommandHistory = null;

				// Add if there is nothing in the command history
				if(this.commandHistory.length == 0) {
					//Console.log('this.commandHistory is empty, adding "'+this.currentCommandString+'"');
					shouldAddCurrentCommandToCommandHistory = true;
				}
				// Don't stack multiple of the same commands
				else if(this.currentCommandString == this.commandHistory[0]) {
					//Console.log('this.currentCommandString "'+this.currentCommandString+'" is the same as the last command entered, not adding to command history');
					shouldAddCurrentCommandToCommandHistory = false;
				}
				else {
					//Console.log('Adding "'+this.currentCommandString+'" to this.commandHistory');
					shouldAddCurrentCommandToCommandHistory = true;
				}

				// Write the history to disk
				if(shouldAddCurrentCommandToCommandHistory && this.commandHistoryFile) {
					this.commandHistory.prepend(this.currentCommandString);
					this.commandHistoryFile.write(this.currentCommandString+"\n");
				}
				
				this.currentCommandHistoryIndex = -1;
			}

			// Log the command
			this.write('> '+this.currentCommandString);

			//Console.log('enter');
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
			Console.writeToTerminal(this.currentCommandString, false);

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
			Console.writeToTerminal(this.currentCommandString, false);

			// Move back to where the cursor should be
			Terminal.cursorLeft(this.currentCommandString.length - this.currentCommandCursorIndex);
		}
		// Any other key
		else {
			//Console.log(key);
			//Console.log(key.charCodeAt(0));
			this.currentCommandString = this.currentCommandString.insert(this.currentCommandCursorIndex, key);
			this.currentCommandCursorIndex += key.length;

			// Clear the line
			Terminal.clearLine();

			// Move to the beginning of the line
			Terminal.cursorLeft(this.currentCommandCursorIndex - 1);

			// Write the current string (this moves the cursor right)
			Console.writeToTerminal(this.currentCommandString, false);

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
				//Console.log('got context!', command, commandToEval);
			}
			catch(error) {
				context = undefined;
			}

			// If we got nothing, try to run the command prior to the last fragment
			if(context === undefined) {
				try {
					commandToEval = variableArray.join('.');
					context = eval(commandToEval);
					//Console.log('got context!', command, commandToEval);
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
		//Console.log(availableCommandArray);

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
				Console.writeToTerminal('.', false);
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
					Console.writeToTerminal(currentCharacterToTest, false);
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
			// Log the command
			this.write('> '+this.currentCommandString+'\\t');

			Console.writeToTerminal("\n");
			Console.writeToTerminal(Terminal.style("\n"+'   '+response.join("\n   ")+"\n", this.commandColor));
			Console.writeToTerminal("\n");
		}

		this.currentCommandCursorIndex = this.currentCommandString.length;
		this.currentCommandString = command;
		Terminal.clearLine();
		Terminal.cursorLeft(this.currentCommandString.length + 1);
		Console.writeToTerminal(this.currentCommandString, false);
	},

	handleCommand: function(command) {
		command = command.trim();

		// Strip any trailing periods
		if(command.endsWith('.')) {
			command = command.substring(0, command.length - 1);
		}

		//Console.log('Command:', command);

		var response;

		Console.writeToTerminal("\n");

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

		if(Generator.is(response)) {
			Console.writeToTerminal(Terminal.style(Console.prepareMessage.call(this, ['function '+command+'*() { ... }'], 'write'), this.commandColor)+"\n");
		}
		else if(Function.is(response)) {
			Console.writeToTerminal(Terminal.style(Console.prepareMessage.call(this, ['function '+command+'() { ... }'], 'write'), this.commandColor)+"\n");	
		}
		else if(Promise.is(response)) {
			Console.writeToTerminal(Terminal.style(Console.prepareMessage.call(this, ['[Promise]'+"\n"], 'write'), 'gray'));	
			Console.writeToTerminal(Terminal.style(Console.prepareMessage.call(this, [response], 'write'), this.commandColor)+"\n");	

			response.then(function() {
				Console.writeToTerminal(Terminal.style(Console.prepareMessage.call(this, ['[Promise Fulfilled]'], 'write'), 'gray')+"\n");	
				Console.writeToTerminal(Terminal.style(Console.prepareMessage.call(this, arguments, 'write'), this.commandColor)+"\n");	
			}.bind(this));
		}
		else if(!command.isEmpty()) {
			Console.writeToTerminal(Terminal.style(Console.prepareMessage.call(this, [response], 'write'), this.commandColor)+"\n");	
		}
		
		return;
	},

});

// Export
module.exports = ConsoleSession;