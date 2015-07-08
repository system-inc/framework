XmlTest = Test.extend({

	testXmlDocumentDeclarations: function*() {
		// Blank XML document
		var actual = new XmlDocument();
		Assert.equal(actual.toString(false), '', 'toString of an empty XML document');

		// Blank XML document with just version
		actual.version = new Version('1.0');
		Assert.equal(actual.toString(false), '<?xml version="1.0"?>', 'toString of an empty XML document with just a version');

		// Blank XML document with just encoding
		actual.version = null;
		actual.encoding = 'UTF-8';
		Assert.equal(actual.toString(false), '<?xml encoding="UTF-8"?>', 'toString of an empty XML document with just an encoding');
		
		// Blank XML document with version and encoding
		actual.version = new Version('1.0');
		actual.encoding = 'UTF-8';
		Assert.equal(actual.toString(false), '<?xml version="1.0" encoding="UTF-8"?>', 'toString of an empty XML document with an encoding and a version');
	},

	testXmlDocumentWithElements: function*() {
		// Blank XML document
		var actual = new XmlDocument();
		//Console.out(actual);
	},

	testXmlElements: function*() {
		// Blank XML element
		var actual = new XmlElement('p');
		Assert.equal(actual.toString(false), '<p></p>', 'toString of an empty XML element');

		// XML element initialized with options
		actual = new XmlElement('p', {
			class: 'testClass',
			style: 'font-size: 12px;',
			content: 'Hello!',
		});
		Assert.equal(actual.toString(false), '<p class="testClass" style="font-size: 12px;">Hello!</p>', 'toString of an XML element with attributes and content');

		actual = new XmlElement('p');
		actual.setAttribute('class', 'testClass');
		Assert.equal(actual.toString(false), '<p class="testClass"></p>', 'setAttribute');
		//Console.out(actual.toString());
	},

});