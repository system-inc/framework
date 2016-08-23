// Dependencies
import HttpError from './HttpError.js';

// Class
class NotFoundError extends HttpError {

	name = 'NotFoundError';
	identifier = 'notFoundError';
	code = 404;
	message = 'Could not find what was requested.';

}

// Export
export default NotFoundError;
