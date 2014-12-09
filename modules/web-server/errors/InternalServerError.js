InternalServerError = HttpError.extend({

	construct: function(message) {
		this.super.apply(this, [500, message]);
		
		this.identifier = 'internalServerError';
		if(!this.message) {
			this.message = 'An unexpected condition was encountered.';
		}
	},

});