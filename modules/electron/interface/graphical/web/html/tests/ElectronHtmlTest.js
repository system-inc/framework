// Dependencies
import ElectronTest from 'framework/modules/electron/tests/ElectronTest.js';

// Class
class ElectronHtmlTest extends ElectronTest {

	async inputPressHtmlNode(htmlNode, button = 'left', pressCount = 1, modifiers = []) {
		var viewPosition = htmlNode.position.relativeToDocumentViewport;
		//var viewPosition = htmlNode.position;
		//console.info('viewPosition', viewPosition);

		return await app.modules.electronModule.inputPress(Number.round(viewPosition.x), Number.round(viewPosition.y), button, pressCount, modifiers);
	}

	async inputPressDoubleHtmlNode(htmlNode, button = 'left', pressCount = 2, modifiers = []) {
		var viewPosition = htmlNode.position.relativeToDocumentViewport;
		//var viewPosition = htmlNode.position;
		//console.info('viewPosition', viewPosition);

		return await app.modules.electronModule.inputPress(Number.round(viewPosition.x), Number.round(viewPosition.y), button, 2, modifiers);
	}

	async inputScrollHtmlNode(htmlNode, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers = []) {
		var viewPosition = htmlNode.position.relativeToDocumentViewport;

		return await app.modules.electronModule.inputScroll(Number.round(viewPosition.x), Number.round(viewPosition.y), deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers);
	}

	async inputHoverHtmlNode(htmlNode) {
		var viewPosition = htmlNode.position.relativeToDocumentViewport;
		
		return await app.modules.electronModule.inputHover(Number.round(viewPosition.x), Number.round(viewPosition.y));
	}

	// This is an abstract class, do not add any tests here

}

// Export
export default ElectronHtmlTest;
