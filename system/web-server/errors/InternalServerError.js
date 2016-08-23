// Dependencies
import HttpError from './HttpError.js';

// Class
class InternalServerError extends HttpError {

	name = 'InternalServerError';
	identifier = 'internalServerError';
	code = 500;
	message = 'An unexpected condition was encountered.';

}

// Export
export default InternalServerError;
