// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlElement = Framework.require('system/html/HtmlElement.js');
var HtmlNode = Framework.require('system/html/HtmlNode.js');
var XmlElement = Framework.require('system/xml/XmlElement.js');
var XmlNode = Framework.require('system/xml/XmlNode.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');

// Class
var HtmlElementTest = Test.extend({

	testHtmlElement: function*() {
		//Console.info(HtmlElement);

		Assert.true(Class.doesImplement(HtmlElement, EventEmitter), 'HtmlElement implements EventEmitter');

		var actual = new HtmlElement('p');

		Assert.true(HtmlElement.is(actual), 'HtmlElement is of type HtmlElement');
		Assert.true(XmlNode.is(actual), 'HtmlElement is of type XmlNode');
		Assert.true(HtmlNode.is(actual), 'HtmlElement is of type HtmlNode');
		Assert.false(XmlElement.is(actual), 'HtmlElement is not a type XmlElement :( (I wish it were)');
	},

	testHtmlElementAddClass: function*() {
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
	},

	testHtmlElementRemoveClass: function*() {
		var actual = new HtmlElement('div');
		actual.addClass('myClass1');
		actual.removeClass('myClass1');
		//Console.highlight(actual.toString());
		Assert.strictEqual(actual.getAttribute('class'), null, 'Remove a class');

		actual = new HtmlElement('div');
		actual.addClass('myClass1');
		actual.addClass('myClass2');
		actual.addClass('myClass3');
		actual.removeClass('myClass2');
		//Console.highlight(actual.toString());
		Assert.strictEqual(actual.getAttribute('class'), 'myClass1 myClass3', 'Remove a class out of three classes');
	},
	
});

// Export
module.exports = HtmlElementTest;