// Dependencies
import { HttpError } from '@framework/system/web/server/errors/HttpError.js';

// Class
class ForbiddenError extends HttpError {

	name = 'ForbiddenError';
	identifier = 'forbiddenError';
	code = 403;
	message = 'Request is forbidden.';
	
	constructor(message) {
		super(...arguments);

		if(message !== undefined) {
			this.message = message;	
		}
		
		this.stack.shift(1); // Get rid of the first item on the stack which is just about Error construction
	}

}

// Export
export { ForbiddenError };
