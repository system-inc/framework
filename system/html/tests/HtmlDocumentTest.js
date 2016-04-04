// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var HtmlElement = Framework.require('system/html/HtmlElement.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');

// Class
var HtmlDocumentTest = Test.extend({

	testHtmlDocument: function*() {
		Assert.true(Class.doesImplement(HtmlDocument, EventEmitter), 'HtmlDocument class implements EventEmitter');

		// Blank HTML document
		var actual = new HtmlDocument();
		Assert.equal(actual.toString(false), '<!DOCTYPE html><html><head></head><body></body></html>', 'toString of an empty HTML document');
	},
	
});

// Export
module.exports = HtmlDocumentTest;