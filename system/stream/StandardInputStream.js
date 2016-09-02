// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardInputStream extends StandardStream {

	constructor() {
		super();

		Node.Process.stdin.on('data', function(data) {
			this.write(data)
		}.bind(this));
	}

	write(data) {
		super.write(data);
		Node.Process.stdin.write(data);
	}

}

// Export
export default StandardInputStream;
