// Dependencies
import { StandardStream } from '@framework/system/stream/StandardStream.js';

// Class
class StandardWritableStream extends StandardStream {

	nodeStream = null;
	nodeStreamStandardWrite = null;

	constructor(nodeStream) {
		super();

		this.nodeStream = nodeStream;
		this.nodeStreamStandardWrite = nodeStream.write;

		// Hook the stream's write method
		this.nodeStream.write = function(chunk, encoding, callback) {
			// Emit the data event
			this.emit('data', chunk);

			// Call the standard write method
			this.nodeStreamStandardWrite.call(this.nodeStream, chunk, encoding, callback);
		}.bind(this);
	}

	write(data) {
		this.nodeStream.write(data);
	}

	writeLine(data = '') {
		data = data+"\n";
		
		this.write(data);
	}

}

// Export
export { StandardWritableStream };
