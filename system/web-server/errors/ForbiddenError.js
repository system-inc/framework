// Dependencies
var HttpError = Framework.require('system/web-server/errors/HttpError.js');

// Class
var ForbiddenError = HttpError.extend({

	name: 'ForbiddenError',
	identifier: 'forbiddenError',
	code: 403,
	message: 'Request is forbidden.',

});

// Export
module.exports = ForbiddenError;