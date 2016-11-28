// Dependencies
import HttpError from 'framework/system/server/web/errors/HttpError.js';

// Class
class UnauthorizedError extends HttpError {

	name = 'UnauthorizedError';
	identifier = 'unauthorizedError';
	code = 401;
	message = 'Authentication is required.';
	
	constructor(message) {
		super(...arguments);
		this.message = message;
		this.stack.shift(1); // Get rid of the first item on the stack which is just about Error construction
	}

}

// Export
export default UnauthorizedError;
