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

}

// Export
export default StandardErrorStream;
