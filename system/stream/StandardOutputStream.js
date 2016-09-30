// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardOutputStream extends StandardStream {

	constructor() {
		super();

		Node.Process.stdout.on('data', function(data) {
			this.super.write(data);
		}.bind(this));
	}

	write(data) {
		super.write(data);
		Node.Process.stdout.write(data);
	}

}

// Export
export default StandardOutputStream;
