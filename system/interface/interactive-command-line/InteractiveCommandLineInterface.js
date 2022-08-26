// Dependencies
import { Interface } from '@framework/system/interface/Interface.js';
import { Settings } from '@framework/system/settings/Settings.js';
import { File } from '@framework/system/file-system/File.js';

// Class
class InteractiveCommandLineInterface extends Interface {

	// History
	historyFile = null;
	history = [];
	currentHistoryIndex = -1;
	currentCommandString = '';
	currentCommandCursorIndex = 0;
	commandColor = 'cyan';

	settings = new Settings({
		history: {
			enabled: true,
			directory: null,
			nameWithoutExtension: 'history',
		},
	});

	constructor(settings) {
		super();

		this.settings.merge(settings);
		//app.info(this.settings);

		// Conditionally enable history
		if(this.settings.get('history.enabled')) {
			this.configureHistory();
		}

		// Capture the standard stream input data
		app.standardStreams.input.on('data', function(event) {
			//app.log('standard input stream data event', event.data);
			this.handleStandardInputStreamData(event.data);
		}.bind(this));
	}

	async configureHistory() {
		var historySettings = this.settings.get('history');
		this.historyFile = new File(Node.Path.join(historySettings.directory, historySettings.nameWithoutExtension+'.log'));
		//app.log('Loading history from ', this.historyFile+'...');

		// Create the file
		await this.historyFile.create();

		// Read the file
		var history = await this.historyFile.read();

		// If there is history
		if(history) {
			history.toString().split("\n").reverse().each(function(index, string) {
				if(string) {
					this.history.append(string);
				}
			}.bind(this));
		}
		else {
			//app.log('No history found.');
		}

		//app.log('this.history', this.history);

		// Open the history file for further writing
		await this.historyFile.open('a+');
	}

	handleStandardInputStreamData(data) {
		//app.info('handleStandardInputStreamData', data);
		this.handleKey(data);
	}

	handleKey(key) {
		// Ctrl-c
		if(key == '\u0003') {
			app.exit('Exiting by user request...');
		}
		// Up
		else if(key == '\u001b[A') {
			//app.log('up', 'this.currentHistoryIndex', this.currentHistoryIndex);

			if(this.currentHistoryIndex < this.history.length - 1) {
				this.currentHistoryIndex++;
			}

			//app.log(this.currentHistoryIndex, this.history);

			if(this.history[this.currentHistoryIndex] !== undefined) {
				this.currentCommandString = this.history[this.currentHistoryIndex];	
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
			app.standardStreams.output.write(this.currentCommandString);
		}
		// Down
		else if(key == '\u001b[B') {
			//app.log('down', 'this.currentHistoryIndex', this.currentHistoryIndex);

			if(this.currentHistoryIndex > -1) {
				this.currentHistoryIndex--;
			}

			//app.log(this.currentHistoryIndex, this.history);

			if(this.currentHistoryIndex == -1) {
				this.currentCommandString = '';
			}
			else if(this.history[this.currentHistoryIndex] !== undefined) {
				this.currentCommandString = this.history[this.currentHistoryIndex];	
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
			app.standardStreams.output.write(this.currentCommandString);
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
				var shouldAddCurrentCommandToHistory = null;

				// Add if there is nothing in the command history
				if(this.history.length == 0) {
					//app.log('this.history is empty, adding "'+this.currentCommandString+'"');
					shouldAddCurrentCommandToHistory = true;
				}
				// Don't stack multiple of the same commands
				else if(this.currentCommandString == this.history[0]) {
					//app.log('this.currentCommandString "'+this.currentCommandString+'" is the same as the last command entered, not adding to command history');
					shouldAddCurrentCommandToHistory = false;
				}
				else {
					//app.log('Adding "'+this.currentCommandString+'" to this.history');
					shouldAddCurrentCommandToHistory = true;
				}

				// Write the history to disk
				if(shouldAddCurrentCommandToHistory && this.historyFile) {
					this.history.prepend(this.currentCommandString);
					this.historyFile.write(this.currentCommandString+"\n");
				}
				
				this.currentHistoryIndex = -1;
			}

			// Log the command
			//app.standardStreams.output.write('> '+this.currentCommandString);

			//app.log('enter');
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
			app.standardStreams.output.write(this.currentCommandString);

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
			app.standardStreams.output.write(this.currentCommandString);

			// Move back to where the cursor should be
			Terminal.cursorLeft(this.currentCommandString.length - this.currentCommandCursorIndex);
		}
		// Any other key
		else {
			//app.log(key);
			//app.log(key.charCodeAt(0));
			this.currentCommandString = this.currentCommandString.insert(this.currentCommandCursorIndex, key);
			this.currentCommandCursorIndex += key.length;

			// Just write out the line instead of doing all of the stuff below
			//app.standardStreams.output.write(key);

			// Clear the line
			Terminal.clearLine();

			// Move to the beginning of the line
			Terminal.cursorLeft(this.currentCommandCursorIndex - 1);

			// Write the current string (this moves the cursor right)
			app.standardStreams.output.write(this.currentCommandString);

			// Move back to where the cursor should be
			Terminal.cursorLeft(this.currentCommandString.length - this.currentCommandCursorIndex);
		}
	}

	assistCommand(command) {
		command = command.trim();

		// The thing we are going to print out
		var response = null;

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
			app.log('commandToEval', commandToEval);
			if(commandToEval.endsWith('.')) {
				commandToEval = commandToEval.replaceLast('.', '');
			}

			// Try to run the command as is (without a trailing period)
			try {
				context = eval(commandToEval);
				app.log('got context!', command, commandToEval);
			}
			catch(error) {
				context = undefined;
			}

			// If we got nothing, try to run the command prior to the last fragment
			if(!context) {
				try {
					commandToEval = variableArray.join('.');
					context = eval(commandToEval);
					app.log('got context!', command, commandToEval);
				}
				catch(error) {
					context = undefined;
				}
			}
		}

		// If we still have no context then just use global as the context
		if(!context) {
			context = global;
		}
		
		// See if the command fragment exists in the context
		var commandMatch = (context[commandFragment] !== undefined);

		// Get all of the available commands for the context
		var keys = Object.getOwnPropertyNames(context);
		//app.log('keys', keys);

		var availableCommandArray = [];
		var availableFunctionsArray = [];
		var availablePropertiesArray = [];
		keys.each(function(keyIndex, key) {
			// Ignore deprecated global keys
			if(
				context === global && (
					key == 'GLOBAL' ||
					key == 'root'
				)
			) {
				// Do nothing
			}
			else {
				if(Function.is(context[key])) {
					availableFunctionsArray.append(key+'()');
				}
				else {
					availablePropertiesArray.append(key);
				}
			}
		});
		availableCommandArray = availablePropertiesArray.sort().concatenate(availableFunctionsArray.sort());
		//app.log(availableCommandArray);

		// Find all of the commands that potentially match
		var partialMatchArray = [];
		availableCommandArray.each(function(index, key) {
			if(key.startsWith(commandFragment)) {
				partialMatchArray.append(key);
			}
		});
		
		// Command matches and is the only match
		if(commandMatch && partialMatchArray.length == 1) {
			// Add a period
			if(!command.endsWith('.')) {
				this.currentCommandCursorIndex++;
				this.currentCommandString += '.';
				app.standardStreams.output.write('.', false);
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
					app.standardStreams.output.write(currentCharacterToTest, false);
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
			//app.standardStreams.output.write('> '+this.currentCommandString+'\\t');

			app.standardStreams.output.write("\n");
			app.standardStreams.output.write(Terminal.style("\n"+'   '+response.join("\n   ")+"\n", this.commandColor));
			app.standardStreams.output.write("\n");
		}

		this.currentCommandCursorIndex = this.currentCommandString.length;
		this.currentCommandString = command;
		Terminal.clearLine();
		Terminal.cursorLeft(this.currentCommandString.length + 1);
		app.standardStreams.output.write(this.currentCommandString);
	}

	handleCommand(command) {
		command = command.trim();

		// Strip any trailing periods
		if(command.endsWith('.')) {
			command = command.substring(0, command.length - 1);
		}

		//app.log('Command:', command);

		var response;

		app.standardStreams.output.write("\n");

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

		// Create and write the response string
		var responseString = '';

		if(Function.is(response)) {
			responseString = 'function '+command+'() { ... }';
			responseString = Terminal.style(responseString, this.commandColor);
			app.standardStreams.output.writeLine(responseString);
		}
		else if(Promise.is(response)) {
			responseString = Terminal.style('Resolving promise...', 'gray');
			app.standardStreams.output.write(responseString);

			response.then(function(resolvedValue) {
				var promiseResponseString = Terminal.style(' resolved:', 'gray');
				promiseResponseString += "\n";
				promiseResponseString += Terminal.style(app.formatLogDataWithoutMetaDataPrefix(resolvedValue), this.commandColor);
				app.standardStreams.output.writeLine(promiseResponseString);
			}.bind(this));
		}
		else if(!command.isEmpty()) {
			responseString = app.formatLogDataWithoutMetaDataPrefix(response);
			responseString = Terminal.style(responseString, this.commandColor);
			app.standardStreams.output.writeLine(responseString);
		}
	}

}

// Export
export { InteractiveCommandLineInterface };
