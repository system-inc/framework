// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardErrorStream extends StandardStream {

	nodeStream = Node.Process.stderr;

	constructor() {
		super();

		if(this.nodeStream.readable) {
			this.nodeStream.on('data', function(data) {
				this.emit('stream.data', data);
			}.bind(this));
		}
	}

}

// Export
export default StandardErrorStream;
