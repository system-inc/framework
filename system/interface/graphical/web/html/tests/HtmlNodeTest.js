// Dependencies
import ElectronTest from 'framework/system/interface/graphical/electron/tests/ElectronTest.js';
import Assert from 'framework/system/test/Assert.js';
import HtmlNode from 'framework/system/interface/graphical/web/html/HtmlNode.js';
import XmlNode from 'framework/system/xml/XmlNode.js';
import EventEmitter from 'framework/system/event/EventEmitter.js';
import HtmlDocument from 'framework/system/interface/graphical/web/html/HtmlDocument.js';
import Html from 'framework/system/interface/graphical/web/html/Html.js';

// Class
class HtmlNodeTest extends ElectronTest {

    async testHtmlNode() {
    	Assert.true(Class.doesImplement(HtmlNode, EventEmitter), 'HtmlNode class implements EventEmitter');
    }

	async testGetSelectionText() {
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
	}

}

// Export
export default HtmlNodeTest;
