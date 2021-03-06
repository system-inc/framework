// Dependencies
import { HttpError } from '@framework/system/web/server/errors/HttpError.js';

// Class
class NotFoundError extends HttpError {

	name = 'NotFoundError';
	identifier = 'notFoundError';
	code = 404;
	message = 'Could not find what was requested.';

	constructor(message) {
		super(...arguments);

		if(message !== undefined) {
			this.message = message;	
		}
		
		this.stack.shift(1); // Get rid of the first item on the stack which is just about Error construction
	}

}

// Export
export { NotFoundError };
