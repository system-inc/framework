// Dependencies
import ElectronHtmlTest from 'framework/modules/electron/interface/graphical/web/html/tests/ElectronHtmlTest.js';
import Assert from 'framework/system/test/Assert.js';

import Html from 'framework/system/interface/graphical/web/html/Html.js';
import HtmlElement from 'framework/system/interface/graphical/web/html/HtmlElement.js';

// Class
class HtmlTest extends ElectronHtmlTest {

	async testHtml() {
		var actual = Html.p();

		Assert.true(HtmlElement.is(actual), 'Static construction of p tag works');
	}

}

// Export
export default HtmlTest;
