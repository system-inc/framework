// Dependencies
import StandardWritableStream from './StandardWritableStream.js';

// Class
class StandardErrorStream extends StandardWritableStream {

	constructor() {
		super(Node.Process.stderr);
	}

}

// Export
export default StandardErrorStream;
