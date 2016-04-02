// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var NotFoundError = Framework.require('system/web-server/errors/NotFoundError.js');
var InternalServerError = Framework.require('system/web-server/errors/InternalServerError.js');

// Class
var AssertTest = Test.extend({

	testThrowsAsynchronously: function*() {
		yield Assert.throwsAsynchronously(function*() {
			throw new Error();
		}, 'throwsAsynchronously works');

		yield Assert.throwsAsynchronously(function*() {
			throw new NotFoundError();
		}, NotFoundError, 'throwsAsynchronously works with Error types');

		yield Assert.doesNotThrowAsynchronously(function*() {
		}, 'doesNotThrowAsynchronously works');
	},

});

// Export
module.exports = AssertTest;