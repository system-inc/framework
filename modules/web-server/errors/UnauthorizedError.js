// Dependencies
var HttpError = Framework.require('modules/web-server/errors/HttpError.js');

// Class
var UnauthorizedError = HttpError.extend({

	construct: function(message) {
		this.super.apply(this, [401, message]);

		this.identifier = 'unauthorized';
		if(!this.message) {
			this.message = 'Authentication is required.';
		}
	},

});

// Export
module.exports = UnauthorizedError;