// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlNode = Framework.require('system/html/HtmlNode.js');
var XmlNode = Framework.require('system/xml/XmlNode.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');

// Class
var HtmlNodeTest = Test.extend({

	testHtmlNode: function*() {
		Assert.true(Class.doesImplement(HtmlNode, EventEmitter), 'HtmlNode class implements EventEmitter');
	},

});

// Export
module.exports = HtmlNodeTest;