require('./InternalServerError');
require('./NotFoundError');
require('./RequestEntityTooLargeError');

HttpError = Error.extend({

	construct: function(code, message) {
		this.super.call(this, message);
		this.code = code;
		this.identifier = 'http';
	},

});