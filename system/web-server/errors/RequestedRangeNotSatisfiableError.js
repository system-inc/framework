// Dependencies
var HttpError = Framework.require('system/web-server/errors/HttpError.js');

// Class
var RequestedRangeNotSatisfiableError = HttpError.extend({

	construct: function(message) {
		this.super.apply(this, [416, message]);

		this.identifier = 'requestedRangeNotSatisfiable';
		if(!this.message) {
			this.message = 'The request asked for a specific portion of a resource, but the server cannot supply that portion.';
		}
	},

});

// Export
module.exports = RequestedRangeNotSatisfiableError;