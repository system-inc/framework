// Dependencies
import StandardWritableStream from './StandardWritableStream.js';

// Class
class StandardOutputStream extends StandardWritableStream {

	constructor() {
		super(Node.Process.stdout);
	}

}

// Export
export default StandardOutputStream;
