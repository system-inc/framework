// Dependencies
import WebGraphicalInterfaceAdapter from 'framework/system/interface/graphical/adapters/web/WebGraphicalInterfaceAdapter.js';
import Electron from 'electron';

// Class
class ElectronGraphicalInterfaceAdapter extends WebGraphicalInterfaceAdapter {

	electronBrowserWindow = null;

	constructor(graphicalInterface, identifier) {
		super(graphicalInterface);

		// Set the Electron browser window
		this.electronBrowserWindow = Electron.remote.getCurrentWindow();
	}

	async sendInputEventMouse(type, x, y, button, globalX, globalY, movementX, movementY, clickCount) {
		this.electronBrowserWindow.webContents.sendInputEvent({
			type: type, // mouseDown, mouseUp, mouseEnter, mouseLeave, contextMenu, mouseWheel, mouseMove, keyDown, keyUp, char
			x: x, // Integer (required)
			y: y, // Integer (required)
			button: button, // String - The button pressed, can be left, middle, right
			globalX: globalX, // Integer
			globalY: globalY, // Integer
			movementX: movementX, // Integer
			movementY: movementY, // Integer
			clickCount: clickCount, // Integer
		});

		// TODO: This is a hack until https://github.com/electron/electron/issues/6291
		// This seems to not resolve the promise until the input event has completed
		await Function.delay(50);

		return true;
	}

	// modifiers: shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	async click(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY, button = 'left', clickCount = 1, modifiers = []) {
		// A trusted click will be fired after mouse down and mouse up

		// Send mouse down
		this.electronBrowserWindow.webContents.sendInputEvent({
			type: 'mouseDown',
			x: relativeToGraphicalInterfaceViewportX,
			y: relativeToGraphicalInterfaceViewportY,
			button: button,
			clickCount: clickCount,
			modifiers: modifiers,
		});

		// Send mouse up
		this.electronBrowserWindow.webContents.sendInputEvent({
			type: 'mouseUp',
			x: relativeToGraphicalInterfaceViewportX,
			y: relativeToGraphicalInterfaceViewportY,
			button: button,
			clickCount: clickCount,
			modifiers: modifiers,
		});

		// TODO: This is a hack until https://github.com/electron/electron/issues/6291
		// This seems to not resolve the promise until the input event has completed
		await Function.delay(50);

		return true;
	}

	async clickView(view, button, clickCount, modifiers) {
		var viewPosition = view.position.relativeToGraphicalInterfaceViewport;
		//var viewPosition = view.position;
		//console.info('viewPosition', viewPosition);

		return await this.click(Number.round(viewPosition.x), Number.round(viewPosition.y), button, clickCount, modifiers);
	}

	async doubleClickView(view, button, clickCount, modifiers) {
		var viewPosition = view.position.relativeToGraphicalInterfaceViewport;
		console.info('viewPosition', viewPosition);

		return await this.click(Number.round(viewPosition.x), Number.round(viewPosition.y), button, 2, modifiers);
	}

	// modifiers: shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	async wheelRotate(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers = []) {
		this.electronBrowserWindow.webContents.sendInputEvent({
			type: 'mouseWheel',
			// x, y is the mouse position inside element where the scroll should occur.
			x: relativeToGraphicalInterfaceViewportX,
			y: relativeToGraphicalInterfaceViewportY,
			//button: 'middle',
			//clickCount: 0,
			// deltaX, deltaY is the relative scroll amount
			deltaX: deltaX,
			deltaY: deltaY,
			wheelTicksX: wheelTicksX,
			wheelTicksY: wheelTicksY,
			accelerationRatioX: accelerationRatioX,
			accelerationRatioY: accelerationRatioY,
			//hasPreciseScrollingDeltas: null,
			canScroll: true,
			//modifiers: modifiers,
		});

		// TODO: This is a hack until https://github.com/electron/electron/issues/6291
		// This seems to not resolve the promise until the input event has completed
		await Function.delay(50);

		return true;
	}

	async wheelRotateHtmlElement(view, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers) {
		var viewPosition = view.getPosition();

		return await this.wheelRotate(Number.round(viewPosition.relativeToGraphicalInterfaceViewport.x), Number.round(viewPosition.relativeToGraphicalInterfaceViewport.y),  deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers);
	}

	// modifiers: shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	async pressKey(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.pressKey', key);

		await this.keyDown(key, modifiers);
		await this.keyUp(key, modifiers);
		await this.keyPress(key, modifiers);

		return true;
	}

	async keyDown(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.keyDown', key, modifiers);

		this.electronBrowserWindow.webContents.sendInputEvent({
			type: 'keyDown',
			keyCode: key,
			modifiers: modifiers,
		});

		// TODO: This is a hack until https://github.com/electron/electron/issues/6291
		// This seems to not resolve the promise until the input event has completed
		await Function.delay(50);

		return true;
	}

	async keyUp(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.keyUp', key, modifiers);

		this.electronBrowserWindow.webContents.sendInputEvent({
			type: 'keyUp',
			keyCode: key,
			modifiers: modifiers,
		});

		await Function.delay(50);

		return true;
	}

	async keyPress(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.keyPress', key, modifiers);

		this.electronBrowserWindow.webContents.sendInputEvent({
			type: 'char',
			keyCode: key,
			modifiers: modifiers,
		});

		await Function.delay(50);

		return true;
	}

	//async copyUsingKeyboard() {
	//	if(app.onWindows()) {
	//		yield ElectronGraphicalInterfaceAdapter.keyDown('c', ['control']);
	//	}
	//	else {
	//		// TODO: Does not work on macOS
	//		console.info('ElectronManager.copyUsingKeyboard does not work on macOS.');
	//		yield ElectronManager.keyDown('c', ['meta']);
	//	}
	//}

	//async cutUsingKeyboard() {
	//	if(app.onWindows()) {
	//		yield ElectronManager.keyDown('x', ['control']);
	//	}
	//	else {
	//		// TODO: Does not work on macOS
	//		console.info('ElectronManager.cutUsingKeyboard does not work on macOS.');
	//		yield ElectronManager.keyDown('x', ['meta']);
	//	}
	//}

	//async pasteUsingKeyboard() {
	//	if(app.onWindows()) {
	//		yield ElectronManager.keyDown('v', ['control']);
	//	}
	//	else {
	//		// TODO: Does not work on macOS
	//		console.info('ElectronManager.pasteUsingKeyboard does not work on macOS.');
	//		yield ElectronManager.keyDown('v', ['meta']);
	//	}
	//}

	//getBrowserWindowBounds() {
	//	var bounds = Electron.remote.getCurrentWindow().getBounds();

	//	return bounds;
	//}

	//setBrowserWindowBounds(width, height, x, y) {
	//	Electron.remote.getCurrentWindow().setBounds({
	//		width: width,
	//		height: height,
	//		x: x,
	//		y: y,
	//	});
	//}

}

// Export
export default ElectronGraphicalInterfaceAdapter;
