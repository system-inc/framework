// Dependencies
import HttpError from './HttpError.js';

// Class
class RequestEntityTooLargeError extends HttpError {

	name = 'RequestEntityTooLargeError';
	identifier = 'requestEntityTooLargeError';
	code = 413;
	message = 'The request was larger than the server is willing or able to process.';

}

// Export
export default RequestEntityTooLargeError;
