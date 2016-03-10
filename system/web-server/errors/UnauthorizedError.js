// Dependencies
var HttpError = Framework.require('system/web-server/errors/HttpError.js');

// Class
var UnauthorizedError = HttpError.extend({

	name: 'UnauthorizedError',
	identifier: 'unauthorizedError',
	code: 401,
	message: 'Authentication is required.',

});

// Export
module.exports = UnauthorizedError;