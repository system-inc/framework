BadRequestError = HttpError.extend({

	construct: function(message) {
		this.super.apply(this, [400, message]);

		this.identifier = 'badRequest';
		if(!this.message) {
			this.message = 'Cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).';
		}
	},

});