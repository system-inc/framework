// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';
import View from './../../../system/web-interface/views/View.js';
import HtmlElement from './../../../system/html/HtmlElement.js';
import HtmlNode from './../../../system/html/HtmlNode.js';
import XmlElement from './../../../system/xml/XmlElement.js';
import XmlNode from './../../../system/xml/XmlNode.js';
import EventEmitter from './../../../system/events/EventEmitter.js';

// Class
class ViewTest extends Test {

	async testView() {
		//app.info(HtmlElement);

		// Create a new view
		var actual = new View();

		Assert.true(HtmlElement.is(actual), 'View is of type HtmlElement');
		Assert.true(XmlNode.is(actual), 'View is of type XmlNode');
		Assert.true(HtmlNode.is(actual), 'View is of type HtmlNode');
		Assert.true(Class.doesImplement(View, XmlElement), 'View class implements XmlElement');
		Assert.true(Class.doesImplement(View, EventEmitter), 'View class implements EventEmitter');
	}
	
}

// Export
export default ViewTest;
