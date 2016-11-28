// Dependencies
import ExtendableError from 'framework/globals/standard/errors/ExtendableError.js';

// Class
class HttpError extends ExtendableError {

	name = 'HttpError';
	identifier = 'httpError';
	code = null;
	
	constructor(message) {
		super(...arguments);
		this.message = message;
		this.stack.shift(1); // Get rid of the first item on the stack which is just about Error construction
	}

}

// Export
export default HttpError;
