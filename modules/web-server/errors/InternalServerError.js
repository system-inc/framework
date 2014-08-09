InternalServerError = Error.extend({

	construct: function(message) {
		this.super.apply(this, arguments);
		this.code = 500;
		this.identifier = 'internalServerError';
		if(!this.message) {
			this.message = 'An unexpected condition was encountered.';
		}
	},

});