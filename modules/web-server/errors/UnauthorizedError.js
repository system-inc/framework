UnauthorizedError = HttpError.extend({

	construct: function(message) {
		this.super.apply(this, [401, message]);

		this.identifier = 'unauthorized';
		if(!this.message) {
			this.message = 'Authentication is required.';
		}
	},

});