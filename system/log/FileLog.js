// Dependencies
import Log from './Log.js';
import File from './../../system/file-system/File.js';
import Directory from './../../system/file-system/Directory.js';

// Class
class FileLog extends Log {

	directory = null;
	nameWithoutExtension = null;
	file = null;

	buffer = '';
	initializingWriteStream = null;
	writeStream = null;

	constructor(directory, nameWithoutExtension) {
		super();

		this.directory = directory;
		this.nameWithoutExtension = nameWithoutExtension;
		this.file = new File(Node.Path.join(this.directory, this.nameWithoutExtension+'.log'));

		this.listen();
	}

	listen() {
		this.on('log.log', function(data) {
			this.write(data);
		}.bind(this));

		this.on('log.info', function(data) {
			this.write(data);
		}.bind(this));

		this.on('log.warn', function(data) {
			this.write(data);
		}.bind(this));

		this.on('log.error', function(data) {
			this.write(data);
		}.bind(this));
	}

	async write(data, removeAnsiEscapeCodesFromString) {
		// removeAnsiEscapeCodesFromString defaults to true
		if(removeAnsiEscapeCodesFromString === undefined) {
			removeAnsiEscapeCodesFromString = true;
		}

		// Make sure we have something to write
		if(!data) {
			return;
		}

		// Conditionally remove ANSI escape codes
		if(removeAnsiEscapeCodesFromString && String.is(data)) {
			data = Terminal.removeAnsiEscapeCodesFromString(data);
		}

		// Troubleshooting why modifying or deleting the log file breaks things, writable is unreliable
		//if(this.writeStream) {
		//	Console.log(this.writeStream);
		//	if(!this.writeStream.writable) {
		//		Console.log('!!!!!!!!!! unwritable!');
		//	}
		//	else {
		//		Console.log('writable!');
		//	}
		//}

		// If we do not have a write stream and are not initializing one, or if the current write stream is not writeable
		//if((!this.writeStream && !this.initializingWriteStream) || (this.writeStream && !this.writeStream.writable)) {
		if(!this.writeStream && !this.initializingWriteStream) {
			// Prevent other calls to .write() from creating more write streams
			this.initializingWriteStream = true;

			// Make sure the directory for the log exists
			var directoryExists = await Directory.exists(this.directory);
			if(!directoryExists) {
				await Directory.create(this.directory);	
			}
			
			// Create a write stream
			this.writeStream = await File.createWriteStream(this.file.file, {
				'flags': 'a',
				'encoding': 'utf8',
			});

			// Mark the write stream as initialized
			if(this.writeStream) {
				this.initializingWriteStream = false;	
			}
		}

		// If we have a write stream, use it
		if(this.writeStream) {
			// Clear the buffer now that we have a write stream
			if(this.buffer) {
				data += this.buffer;
				this.buffer = '';
			}

			// Write to the log
			this.writeStream.write(data); // No need to await here since we aren't doing anything with the results
			//Console.log(this.writeStream);
		}
		// If we don't have a write stream, add the data to the buffer
		else {
			this.buffer += data;
		}
	}

}

// Export
export default Log;
