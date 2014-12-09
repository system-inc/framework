HttpError = Error.extend({

	construct: function(code, message) {
		// Invoke Error's contructor
		this.super.call(this, message);

		// Shift the stack down two more to start at the real problem
		this.stack.shift(2);

		this.code = code;
		this.identifier = 'http';
	},

});