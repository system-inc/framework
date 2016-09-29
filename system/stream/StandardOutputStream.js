// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardOutputStream extends StandardStream {

	constructor() {
		super();

		if(Node.Process.stdout.readable) {
			Node.Process.stdout.on('data', function(data) {
				this.write(data)
			}.bind(this));
		}
		else {
			console.warn('Standard output stream is not readable.');
		}
	}

	write(data) {
		// Use console.log if standard out is not readable
		if(!Node.Process.stdout.readable) {
			console.log(data);
		}

		super.write(data);
	}

	writeLine(data = '') {
		// Only append a new line if the stream is readable, because if we fallback to console.log it will automatically add a line ending
		if(Node.Process.stdout.readable) {
			data = data+"\n";
		}		
		
		this.write(data);
	}

}

// Export
export default StandardOutputStream;
