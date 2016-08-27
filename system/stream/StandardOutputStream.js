// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardOutputStream extends StandardStream {

	constructor() {
		super(Node.Process.stdout);
	}

}

// Export
export default StandardOutputStream;
