Log = Class.extend({

	directory: null,
	nameWithoutExtension: null,
	file: null,

	construct: function(directory, nameWithoutExtension) {
		this.directory = directory;
		this.nameWithoutExtension = nameWithoutExtension;
		this.file = new File(this.directory+this.nameWithoutExtension+'.log');
		//console.log(this.file);
	},

	write: function*(data) {
		//// Open a file handle if we don't have one
		//if(!this.file.handle) {
		//	//console.log('No this.file.handle, calling this.file.open()')
		//	var handle = yield this.file.open('a');
		//	//console.log('this.file.handle', this.file.handle);
		//}

		//// Make sure we have something to write
		//if(!data) {
		//	return;
		//}

		//// Add a line break at the end of every log data
		//data += "\n";

		//// Write to the log
		//this.file.write(data); // No need to yield here since we aren't doing anything with the results
	}

});