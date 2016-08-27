// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardErrorStream extends StandardStream {

	constructor() {
		super(Node.Process.stderr);
	}

}

// Export
export default StandardErrorStream;
