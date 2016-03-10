// Dependencies
var HttpError = Framework.require('system/web-server/errors/HttpError.js');

// Class
var BadRequestError = HttpError.extend({

	name: 'BadRequestError',
	identifier: 'badRequestError',
	code: 400,
	message: 'Cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).',

});

// Export
module.exports = BadRequestError;