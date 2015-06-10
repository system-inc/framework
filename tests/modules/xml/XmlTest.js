XmlTest = Test.extend({

	testXmlDocumentDeclarations: function*() {
		// Blank XML document
		var actual = new XmlDocument();
		Assert.equal(actual.toString(), '', 'The string representation of an empty XML document');

		// Blank XML document with just version
		actual.version = new Version('1.0');
		Assert.equal(actual.toString(), '<?xml version="1.0"?>', 'The string representation of an empty XML document with just a version');

		// Blank XML document with just encoding
		actual.version = null;
		actual.encoding = 'UTF-8';
		Assert.equal(actual.toString(), '<?xml encoding="UTF-8"?>', 'The string representation of an empty XML document with just an encoding');
		
		// Blank XML document with version and encoding
		actual.version = new Version('1.0');
		actual.encoding = 'UTF-8';
		Assert.equal(actual.toString(), '<?xml version="1.0" encoding="UTF-8"?>', 'The string representation of an empty XML document with an encoding and a version');
	},

	testXmlDocumentWithElements: function*() {
		// Blank XML document
		var actual = new XmlDocument();
		//Console.out(actual);
	},

	testXmlElements: function*() {
		// Blank XML element
		var actual = new XmlElement('p');

		// XML element initialized with options
		actual = new XmlElement('p', {
			class: 'test',
			style: 'font-size: 12px;',
			content: 'Hello!',
		});
		Console.out(actual.toString());
	},

});