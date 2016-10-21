// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardInputStream extends StandardStream {

	nodeStream = Node.Process.stdin;
	nodeStreamStandardWrite = Node.Process.stdin.write;

	constructor() {
		super();

		this.setEncoding('utf8');
		this.setRawMode(true);

		this.nodeStream.on('data', function(data) {
			this.emit('stream.data', data);
		}.bind(this));
	}

	setEncoding(encoding) {
		this.nodeStream.setEncoding(encoding);
	}

	setRawMode(enabled) {
		// Raw mode takes input character by character rather than line by line
		this.nodeStream.setRawMode(enabled);
	}

}

// Export
export default StandardInputStream;
