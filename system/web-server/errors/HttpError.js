// Class
var HttpError = FrameworkError.extend({

	code: null,

	construct: function(code, message) {
		// Invoke Error's constructor
		this.super.call(this, message);

		// Shift the stack down two more to start at the real problem
		//this.stack.shift(2);

		this.code = code;
		this.identifier = 'http';
	},

});

// Export
module.exports = HttpError;