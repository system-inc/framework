NotFoundError = Error.extend({

	construct: function(message) {
		this.super.apply(this, arguments);
		this.code = 404;
		this.identifier = 'notFound';
		if(!this.message) {
			this.message = 'Could not find what was requested.';
		}
	},

});