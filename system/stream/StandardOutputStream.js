// Dependencies
import { StandardWritableStream } from '@framework/system/stream/StandardWritableStream.js';

// Class
class StandardOutputStream extends StandardWritableStream {

	constructor() {
		super(Node.Process.stdout);
	}

	getWindowWidth() {
		return this.nodeStream.columns;
	}

	getWindowHeight() {
		return this.nodeStream.rows;
	}

	getWindowDimensions() {
		return {
			width: this.getWindowWidth(),
			height: this.getWindowHeight(),
		};
	}

}

// Export
export { StandardOutputStream };
