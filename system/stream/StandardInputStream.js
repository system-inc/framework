// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardInputStream extends StandardStream {

	constructor() {
		super();

		var superWrite = super.write;

		Node.Process.stdin.on('data', function(data) {
			superWrite.apply(this, arguments);
		}.bind(this));
	}

	write(data) {
		super.write(data);
		Node.Process.stdin.write(data);
	}

}

// Export
export default StandardInputStream;
