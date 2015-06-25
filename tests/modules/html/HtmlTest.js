HtmlTest = Test.extend({

	testHtmlDocument: function*() {
		// Blank HTML document
		var actual = new HtmlDocument();
		Assert.equal(actual.toString(false), '<!DOCTYPE html><html><head></head><body></body></html>', 'toString of an empty HTML document');
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