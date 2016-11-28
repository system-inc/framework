// Dependencies
import StandardWritableStream from 'framework/system/stream/StandardWritableStream.js';

// Class
class StandardOutputStream extends StandardWritableStream {

	constructor() {
		super(Node.Process.stdout);
	}

}

// Export
export default StandardOutputStream;
