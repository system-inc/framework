// Dependencies
import { HtmlElectronTest } from '@framework/modules/electron/interface/graphical/web/html/tests/HtmlElectronTest.js';
import { Assert } from '@framework/system/test/Assert.js';

import { HtmlElement } from '@framework/system/interface/graphical/web/html/HtmlElement.js';
import { HtmlNode } from '@framework/system/interface/graphical/web/html/HtmlNode.js';
import { XmlElement } from '@framework/system/xml/XmlElement.js';
import { XmlNode } from '@framework/system/xml/XmlNode.js';
import { EventEmitter } from '@framework/system/event/EventEmitter.js';

// Class
class HtmlElementElectronTest extends HtmlElectronTest {

	async testHtmlElement() {
		//app.info(HtmlElement);

		Assert.true(Class.doesImplement(HtmlElement, EventEmitter), 'HtmlElement class implements EventEmitter');

		var actual = new HtmlElement('p');

		Assert.true(HtmlElement.is(actual), 'HtmlElement is of type HtmlElement');
		Assert.true(XmlNode.is(actual), 'HtmlElement is of type XmlNode');
		Assert.true(HtmlNode.is(actual), 'HtmlElement is of type HtmlNode');
		Assert.false(XmlElement.is(actual), 'HtmlElement is not a type XmlElement :( (I wish it were)');
	}

	async testHtmlElementAddClass() {
		var actual = new HtmlElement('div');
		Assert.strictEqual(actual.getAttribute('class'), null, 'No class attribute by default');

		actual.addClass('myClass1');
		Assert.equal(actual.getAttribute('class'), 'myClass1', 'Add a single class');

		actual = new HtmlElement('div');
		actual.addClass('myClass1 myClass2');
		Assert.equal(actual.getAttribute('class'), 'myClass1 myClass2', 'Add two classes in one call');

		actual = new HtmlElement('div');
		actual.addClass('myClass1');
		actual.addClass('myClass2');
		Assert.equal(actual.getAttribute('class'), 'myClass1 myClass2', 'Add two classes in two calls');
	}

	async testHtmlElementRemoveClass() {
		var actual = new HtmlElement('div');
		actual.addClass('myClass1');
		actual.removeClass('myClass1');
		//app.highlight(actual.toString());
		Assert.strictEqual(actual.getAttribute('class'), null, 'Remove a class');

		actual = new HtmlElement('div');
		actual.addClass('myClass1');
		actual.addClass('myClass2');
		actual.addClass('myClass3');
		actual.removeClass('myClass2');
		//app.highlight(actual.toString());
		Assert.strictEqual(actual.getAttribute('class'), 'myClass1 myClass3', 'Remove a class out of three classes');
	}
	
}

// Export
export { HtmlElementElectronTest };
