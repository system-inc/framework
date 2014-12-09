RequestEntityTooLargeError = HttpError.extend({

	construct: function(message) {
		this.super.apply(this, [413, message]);

		this.identifier = 'requestEntityTooLarge';
		if(!this.message) {
			this.message = 'The request was larger than the server is willing or able to process.';
		}
	},

});