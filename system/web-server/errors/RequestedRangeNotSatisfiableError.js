// Dependencies
var HttpError = Framework.require('system/web-server/errors/HttpError.js');

// Class
var RequestedRangeNotSatisfiableError = HttpError.extend({

	name: 'RequestedRangeNotSatisfiableError',
	identifier: 'requestedRangeNotSatisfiableError',
	code: 416,
	message: 'The request asked for a specific portion of a resource, but the server cannot supply that portion.',

});

// Export
module.exports = RequestedRangeNotSatisfiableError;