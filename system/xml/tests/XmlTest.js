// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import XmlDocument from 'framework/system/xml/XmlDocument.js';
import XmlElement from 'framework/system/xml/XmlElement.js';
import Version from 'framework/system/version/Version.js';

// Class
class XmlTest extends Test {

	async testXmlDocumentDeclarations() {
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
	}

	async testXmlDocumentWithElements() {
		// Blank XML document
		var actual = new XmlDocument();
		//app.log(actual);
	}

	async testXmlElements() {
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

		//actual = new XmlElement('p');
		//actual.setAttribute('class', 'testClass');
		//Assert.equal(actual.toString(false), '<p class="testClass"></p>', 'setAttribute');
		//app.log(actual.toString());
	}

}

// Export
export default XmlTest;
