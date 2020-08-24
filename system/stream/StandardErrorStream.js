// Dependencies
import { StandardWritableStream } from '@framework/system/stream/StandardWritableStream.js';

// Class
class StandardErrorStream extends StandardWritableStream {

	constructor() {
		super(Node.Process.stderr);
	}

}

// Export
export { StandardErrorStream };
