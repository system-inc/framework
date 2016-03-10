// Dependencies
var HttpError = Framework.require('system/web-server/errors/HttpError.js');

// Class
var RequestEntityTooLargeError = HttpError.extend({

	name: 'RequestEntityTooLargeError',
	identifier: 'requestEntityTooLargeError',
	code: 413,
	message: 'The request was larger than the server is willing or able to process.',

});

// Export
module.exports = RequestEntityTooLargeError;