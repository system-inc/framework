// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardOutputStream extends StandardStream {

	constructor() {
		super();

		var superWrite = super.write;

		Node.Process.stdout.on('data', function(data) {
			superWrite.apply(this, arguments);
		}.bind(this));
	}

	write(data) {
		super.write(data);
		Node.Process.stdout.write(data);
	}

}

// Export
export default StandardOutputStream;
