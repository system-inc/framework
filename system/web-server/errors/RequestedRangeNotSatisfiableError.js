// Dependencies
import HttpError from './HttpError.js';

// Class
class RequestedRangeNotSatisfiableError extends HttpError {

	name = 'RequestedRangeNotSatisfiableError';
	identifier = 'requestedRangeNotSatisfiableError';
	code = 416;
	message = 'The request asked for a specific portion of a resource, but the server cannot supply that portion.';

}

// Export
export default RequestedRangeNotSatisfiableError;
