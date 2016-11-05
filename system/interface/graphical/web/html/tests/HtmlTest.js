// Dependencies
import Test from 'system/test/Test.js';
import Assert from 'system/test/Assert.js';
import Html from 'system/interface/graphical/web/html/Html.js';
import HtmlElement from 'system/interface/graphical/web/html/HtmlElement.js';

// Class
class HtmlTest extends Test {

	async testHtml() {
		var actual = Html.p();

		Assert.true(HtmlElement.is(actual), 'Static construction of p tag works');
	}

}

// Export
export default HtmlTest;
