// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var HttpError = Framework.require('system/web-server/errors/HttpError.js');

// Class
var HttpErrorTest = Test.extend({

	testHttpErrorConstruction: function() {
		var httpError = new HttpError(1, 'Test HttpError message.');

		Console.info(httpError);

		throw httpError;
	},

});

// Export
module.exports = HttpErrorTest;