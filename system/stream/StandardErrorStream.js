// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardErrorStream extends StandardStream {

	constructor() {
		super();

		var superWrite = super.write;

		Node.Process.stderr.on('data', function(data) {
			superWrite.apply(this, arguments);
		}.bind(this));
	}

	write(data) {
		super.write(data);
		Node.Process.stderr.write(data);
	}

}

// Export
export default StandardErrorStream;
