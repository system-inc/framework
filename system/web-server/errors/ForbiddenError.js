// Dependencies
import HttpError from './HttpError.js';

// Class
class ForbiddenError extends HttpError {

	name = 'ForbiddenError';
	identifier = 'forbiddenError';
	code = 403;
	message = 'Request is forbidden.';

}

// Export
export default ForbiddenError;
