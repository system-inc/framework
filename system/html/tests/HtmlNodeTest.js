// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlNode = Framework.require('system/html/HtmlNode.js');
var XmlNode = Framework.require('system/xml/XmlNode.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');

// Class
var HtmlNodeTest = Test.extend({

	testHtmlNode: function*() {
		Assert.true(Class.doesImplement(HtmlNode, EventEmitter), 'HtmlNode class implements EventEmitter');
	},

	testGetSelectedText: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        p1 = Html.p('This is line 1.');
        p2 = Html.p('This is line 2.');
        p3 = Html.p('This is line 3.');

        htmlDocument.body.append(p1);
        htmlDocument.body.append(p2);
        htmlDocument.body.append(p3);

        // Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = HtmlNodeTest;