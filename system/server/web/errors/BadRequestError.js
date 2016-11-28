// Dependencies
import HttpError from 'framework/system/server/web/errors/HttpError.js';

// Class
class BadRequestError extends HttpError {

	name = 'BadRequestError';
	identifier = 'badRequestError';
	code = 400;
	message = 'Cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).';
	
	constructor(message) {
		super(...arguments);
		this.message = message;
		this.stack.shift(1); // Get rid of the first item on the stack which is just about Error construction
	}

}

// Export
export default BadRequestError;
