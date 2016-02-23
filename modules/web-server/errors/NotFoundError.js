// Dependencies
var HttpError = Framework.require('modules/web-server/errors/HttpError.js');

// Class
var NotFoundError = HttpError.extend({

	construct: function(message) {
		this.super.apply(this, [404, message]);

		this.identifier = 'notFound';
		if(!this.message) {
			this.message = 'Could not find what was requested.';
		}
	},

});

// Export
module.exports = NotFoundError;