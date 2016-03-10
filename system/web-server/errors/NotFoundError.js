// Dependencies
var HttpError = Framework.require('system/web-server/errors/HttpError.js');

// Class
var NotFoundError = HttpError.extend({

	name: 'NotFoundError',
	identifier: 'notFoundError',
	code: 404,
	message: 'Could not find what was requested.',

});

// Export
module.exports = NotFoundError;