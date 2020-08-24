// Dependencies
import { HttpError } from '@framework/system/server/web/errors/HttpError.js';

// Class
class RequestedRangeNotSatisfiableError extends HttpError {

	name = 'RequestedRangeNotSatisfiableError';
	identifier = 'requestedRangeNotSatisfiableError';
	code = 416;
	message = 'The request asked for a specific portion of a resource, but the server cannot supply that portion.';
	
	constructor(message) {
		super(...arguments);

		if(message !== undefined) {
			this.message = message;	
		}
		
		this.stack.shift(1); // Get rid of the first item on the stack which is just about Error construction
	}

}

// Export
export { RequestedRangeNotSatisfiableError };
