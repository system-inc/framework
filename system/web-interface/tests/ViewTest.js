// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var View = Framework.require('system/web-interface/views/View.js');
var HtmlElement = Framework.require('system/html/HtmlElement.js');
var HtmlNode = Framework.require('system/html/HtmlNode.js');
var XmlElement = Framework.require('system/xml/XmlElement.js');
var XmlNode = Framework.require('system/xml/XmlNode.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');

// Class
var ViewTest = Test.extend({

	testView: function*() {
		//Console.info(HtmlElement);

		// Create a new view
		var actual = new View();

		Assert.true(HtmlElement.is(actual), 'View is of type HtmlElement');
		Assert.true(XmlNode.is(actual), 'View is of type XmlNode');
		Assert.true(HtmlNode.is(actual), 'View is of type HtmlNode');
		Assert.true(Class.doesImplement(View, XmlElement), 'View class implements XmlElement');
		Assert.true(Class.doesImplement(View, EventEmitter), 'View class implements EventEmitter');
	},
	
});

// Export
module.exports = ViewTest;