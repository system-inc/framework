// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import Html from 'framework/system/interface/graphical/web/html/Html.js';
import HtmlElement from 'framework/system/interface/graphical/web/html/HtmlElement.js';

// Class
class HtmlTest extends Test {

	async testHtml() {
		var actual = Html.p();

		Assert.true(HtmlElement.is(actual), 'Static construction of p tag works');
	}

}

// Export
export default HtmlTest;
