// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardOutputStream extends StandardStream {

	nodeStream = Node.Process.stdout;

	constructor() {
		super();

		this.nodeStream.on('data', function(data) {
			this.emit('stream.data', data);
		}.bind(this));
	}

}

// Export
export default StandardOutputStream;
