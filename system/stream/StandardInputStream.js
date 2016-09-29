// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardInputStream extends StandardStream {

	constructor() {
		super();

		if(Node.Process.stdin.readable) {
			Node.Process.stdin.on('data', function(data) {
				this.write(data)
			}.bind(this));
		}
		else {
			console.warn('Standard input stream is not readable.');
		}
	}

	write(data) {
		super.write(data);
	}

}

// Export
export default StandardInputStream;
