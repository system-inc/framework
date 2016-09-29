// Dependencies
import ExtendableError from './../../../globals/standard/errors/ExtendableError.js';

// Class
class HttpError extends ExtendableError {

	name = 'HttpError';
	identifier = 'httpError';
	code = null;

}

// Export
export default HttpError;
