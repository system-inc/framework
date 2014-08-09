RequestEntityTooLargeError = Error.extend({

	construct: function(message) {
		this.super.apply(this, arguments);
		this.code = 413;
		this.identifier = 'requestEntityTooLarge';
		if(!this.message) {
			this.message = 'The request was larger than the server is willing or able to process.';
		}
	},

});