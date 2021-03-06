// Dependencies
import { HtmlElectronTest } from '@framework/modules/electron/interface/graphical/web/html/tests/HtmlElectronTest.js';
import { Assert } from '@framework/system/test/Assert.js';

import { HtmlDocument } from '@framework/system/interface/graphical/web/html/HtmlDocument.js';
import { HtmlElement } from '@framework/system/interface/graphical/web/html/HtmlElement.js';
import { EventEmitter } from '@framework/system/event/EventEmitter.js';

// Class
class HtmlDocumentElectronTest extends HtmlElectronTest {

	async testHtmlDocument() {
		Assert.true(Class.doesImplement(HtmlDocument, EventEmitter), 'HtmlDocument class implements EventEmitter');

		// Blank HTML document
		var actual = new HtmlDocument();
		Assert.equal(actual.toString(false), '<!DOCTYPE html><html><head></head><body></body></html>', 'toString of an empty HTML document');
	}
	
}

// Export
export { HtmlDocumentElectronTest };
