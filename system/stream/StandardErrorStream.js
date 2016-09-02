// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardErrorStream extends StandardStream {

	constructor() {
		super();

		Node.Process.stderr.on('data', function(data) {
			this.write(data)
		}.bind(this));
	}

	write(data) {
		super.write(data);
		Node.Process.stderr.write(data);
	}

}

// Export
export default StandardErrorStream;
