Log = Class.extend({

	directory: null,
	nameWithoutExtension: null,
	buffer: '',
	file: null,
	writeStream: null,
	initializingWriteStream: null,

	construct: function(directory, nameWithoutExtension) {
		this.directory = directory;
		this.nameWithoutExtension = nameWithoutExtension;
		this.file = new File(this.directory+this.nameWithoutExtension+'.log');
	},

	write: function*(data) {
		// Make sure we have something to write
		if(!data) {
			return;
		}

		// Troubleshooting why modifying or deleting the log file breaks things, writable is unreliable
		//if(this.writeStream) {
		//	console.log(this.writeStream);
		//	if(!this.writeStream.writable) {
		//		console.log('!!!!!!!!!! unwritable!');
		//	}
		//	else {
		//		console.log('writable!');
		//	}
		//}

		// If we do not have a write stream and are not initializing one, or if the current write stream is not writeable
		//if((!this.writeStream && !this.initializingWriteStream) || (this.writeStream && !this.writeStream.writable)) {
		if(!this.writeStream && !this.initializingWriteStream) {
			// Prevent other calls to .write() from creating more write streams
			this.initializingWriteStream = true;

			// Create a write stream
			this.writeStream = yield File.createWriteStream(this.file.file, {
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
			this.writeStream.write(data); // No need to yield here since we aren't doing anything with the results
			//console.log(this.writeStream);
		}
		// If we don't have a write stream, add the data to the buffer
		else {
			this.buffer += data;
		}
	}

});