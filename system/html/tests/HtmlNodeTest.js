// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlNode = Framework.require('system/html/HtmlNode.js');
var XmlNode = Framework.require('system/xml/XmlNode.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');

// Class
var HtmlNodeTest = ElectronTest.extend({

    testHtmlNode: function*() {
    	Assert.true(Class.doesImplement(HtmlNode, EventEmitter), 'HtmlNode class implements EventEmitter');
    },

	testGetSelectionText: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        var p1 = Html.p('This is line 1.');
        var p2 = Html.p('This is line 2.');
        var p3 = Html.p('This is line 3.');

        htmlDocument.body.append(p1);
        htmlDocument.body.append(p2);
        htmlDocument.body.append(p3);

        // Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Select text
        //Console.standardLog(p2);
        p2.select();
        //Console.standardLog('p2.getSelectionText()', p2.getSelectionText());

        Assert.strictEqual(p1.getSelectionText(), null, 'If no text is selected null is returned');
        Assert.strictEqual(p2.getSelectionText(), 'This is line 2.', 'getSelectionText returns a string matching the selected text');
        Assert.strictEqual(p3.getSelectionText(), null, 'If no text is selected null is returned');
        Assert.strictEqual(htmlDocument.body.getSelectionText(), 'This is line 2.', 'getSelectionText returns a string matching the selected text');

        //throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = HtmlNodeTest;