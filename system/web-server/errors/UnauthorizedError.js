// Dependencies
import HttpError from './HttpError.js';

// Class
class UnauthorizedError extends HttpError {

	name = 'UnauthorizedError';
	identifier = 'unauthorizedError';
	code = 401;
	message = 'Authentication is required.';

}

// Export
export default UnauthorizedError;
