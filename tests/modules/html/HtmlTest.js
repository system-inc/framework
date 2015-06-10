HtmlTest = Test.extend({

	testHtmlDocument: function*() {
		// Blank HTML document
		var actual = new HtmlDocument();
		Assert.equal(actual.toString(), '<!DOCTYPE HTML><html><head></head><body></body></html>', 'toString of an empty HTML document');

		actual.body.append(Html.div('Hi there!').append(Html.p('Hi!')));

		Console.highlight(actual.toString(true));
	},

});