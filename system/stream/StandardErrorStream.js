// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardErrorStream extends StandardStream {

	constructor() {
		super();

		if(Node.Process.stderr.readable) {
			Node.Process.stderr.on('data', function(data) {
				this.write(data)
			}.bind(this));	
		}
		else {
			console.warn('Standard error stream is not readable.');
		}
	}

	write(data) {
		// Use console.error if standard out is not readable
		if(!Node.Process.stderr.readable) {
			console.error(data);
		}

		super.write(data);
	}

	writeLine(data = '') {
		// Only append a new line if the stream is readable, because if we fallback to console.error it will automatically add a line ending
		if(Node.Process.stderr.readable) {
			data = data+"\n";
		}
		
		this.write(data);
	}

}

// Export
export default StandardErrorStream;
