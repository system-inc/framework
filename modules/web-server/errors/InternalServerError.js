InternalServerError = Error.extend({

	construct: function(message) {
		this.super.apply(this, arguments);
		this.code = 500;
		this.name = 'internalServerError';
	},

});

//InternalServerError = function(message) {
//	var temp = Error.apply(this, arguments);

//	this.message = message;
//	this.stack = temp.stack;
//	this.code = 500;
//	this.identifier = 'internalServerError';
//	this.url = null;
//};
//InternalServerError.prototype = Error.prototype;