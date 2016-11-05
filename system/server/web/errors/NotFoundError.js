// Dependencies
import HttpError from './HttpError.js';

// Class
class NotFoundError extends HttpError {

	name = 'NotFoundError';
	identifier = 'notFoundError';
	code = 404;
	message = 'Could not find what was requested.';

	constructor(message) {
		super(...arguments);
		this.message = message;
		this.stack.shift(1); // Get rid of the first item on the stack which is just about Error construction
	}

}

// Export
export default NotFoundError;
