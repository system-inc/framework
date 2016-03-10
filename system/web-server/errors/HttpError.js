// Class
var HttpError = Error.extend({

	name: 'HttpError',
	identifier: 'httpError',
	code: null,
	message: null,

	construct: function(message) {
		// Capture the stack trace (https://github.com/v8/v8/wiki/Stack%20Trace%20API#stack-trace-collection-for-custom-exceptions)
  		Error.captureStackTrace(this, this.constructor);

  		if(message) {
  			this.message = message;	
  		}
	},

});

// Export
module.exports = HttpError;