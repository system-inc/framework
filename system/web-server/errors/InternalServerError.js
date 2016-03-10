// Dependencies
var HttpError = Framework.require('system/web-server/errors/HttpError.js');

// Class
var InternalServerError = HttpError.extend({

	name: 'InternalServerError',
	identifier: 'internalServerError',
	code: 500,
	message: 'An unexpected condition was encountered.',

});

// Export
module.exports = InternalServerError;