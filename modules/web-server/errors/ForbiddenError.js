// Dependencies
var HttpError = Framework.require('modules/web-server/errors/HttpError.js');

// Class
var ForbiddenError = HttpError.extend({

	construct: function(message) {
		this.super.apply(this, [403, message]);

		this.identifier = 'forbidden';
		if(!this.message) {
			this.message = 'Request is forbidden.';
		}
	},

});

// Export
module.exports = ForbiddenError;