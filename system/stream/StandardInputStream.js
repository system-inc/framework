// Dependencies
import StandardStream from './StandardStream.js';

// Class
class StandardInputStream extends StandardStream {

	constructor() {
		super(Node.Process.stdin);
	}

}

// Export
export default StandardInputStream;
