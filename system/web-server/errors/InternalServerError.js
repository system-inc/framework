// Dependencies
import HttpError from './HttpError.js';

// Class
class InternalServerError extends HttpError {

	name = 'InternalServerError';
	identifier = 'internalServerError';
	code = 500;
	message = 'An unexpected condition was encountered.';
	
	constructor(message) {
		super(...arguments);
		this.message = message;
		this.stack.shift(1); // Get rid of the first item on the stack which is just about Error construction
	}

}

// Export
export default InternalServerError;
