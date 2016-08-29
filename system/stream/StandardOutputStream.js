// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardOutputStream extends StandardStream {

	constructor() {
		super();

		Node.Process.stdout.on('data', function(data) {
			this.write(data)
		}.bind(this));
	}

	write(data) {
		Node.Process.stdout.write(data);
	}

}

// Export
export default StandardOutputStream;
