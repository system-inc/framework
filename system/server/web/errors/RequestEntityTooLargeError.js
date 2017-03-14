// Dependencies
import HttpError from 'framework/system/server/web/errors/HttpError.js';

// Class
class RequestEntityTooLargeError extends HttpError {

	name = 'RequestEntityTooLargeError';
	identifier = 'requestEntityTooLargeError';
	code = 413;
	message = 'The request was larger than the server is willing or able to process.';
	
	constructor(message) {
		super(...arguments);

		if(message !== undefined) {
			this.message = message;	
		}
		
		this.stack.shift(1); // Get rid of the first item on the stack which is just about Error construction
	}

}

// Export
export default RequestEntityTooLargeError;
