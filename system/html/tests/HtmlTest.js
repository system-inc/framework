// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var Html = Framework.require('system/html/Html.js');
var HtmlElement = Framework.require('system/html/HtmlElement.js');

// Class
var HtmlTest = Test.extend({

	testHtml: function*() {
		var actual = Html.p();

		Assert.true(HtmlElement.is(actual), 'Static construction of p tag works');
	},

});

// Export
module.exports = HtmlTest;