Log = Class.extend({

	directory: null,
	nameWithoutExtension: null,
	file: null,
	handle: null,

	construct: function(directory, nameWithoutExtension) {
		this.directory = directory;
		this.nameWithoutExtension = nameWithoutExtension;
		this.file = new File(this.directory+this.nameWithoutExtension+'.log');
		//console.log(this.file);
	},

	write: function*(data) {
		// Make sure we have something to write
		if(!data) {
			return;
		}

		// Add a line break at the end of every log data
		data += "\n";

		// If we don't have an open file handle
		if(!this.file.handle) {
			yield this.file.open();
		}

		yield this.file.write(data);
	}

});