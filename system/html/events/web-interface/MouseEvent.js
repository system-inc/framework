// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var MouseEvent = HtmlEvent.extend({

	type: null,

	// Keyboard keys down when the mouse event was emitted
	keyboardKeysDown: {
		alt: null, // true if the alt key was down when the mouse event was emitted
		ctrl: null, // true if the control key was down when the mouse event was emitted
		meta: null, // true if the meta key was down when the mouse event was emitted
		shift: null, // true if the shift key was down when the mouse event was emitted
	},

	// Mouse buttons down when the mouse event was emitted
	mouseButtonsDown: {
		1: null,
		2: null,
		3: null,
		4: null,
		5: null,
	},

	// The button number that was pressed when the mouse event was emitted
	// 1: Main button pressed, usually the left button or the un-initialized state
	// 2: Secondary button pressed, usually the right button
	// 3: Auxiliary button pressed, usually the wheel button or the middle button (if present)
	// 4: Fourth button, typically the Browser Back button
	// 5: Fifth button, typically the Browser Forward button
	button: null,

	offsets: {
		emitter: {
			x: null, // The X coordinate of the mouse pointer relative to the position of the padding edge of the target node
			y: null, // The Y coordinate of the mouse pointer relative to the position of the padding edge of the target node
		},

		relativeAncestor: {
			x: null, // The X coordinate of the mouse pointer relative to the closest positioned ancestor element
			y: null, // The Y coordinate of the mouse pointer relative to the closest positioned ancestor element
		},

		viewport: {
			x: null, // The X coordinate of the mouse pointer in local (DOM content) coordinates
			y: null, // The Y coordinate of the mouse pointer in local (DOM content) coordinates
		},

		document: {
			x: null, // The X coordinate of the mouse pointer relative to the whole document
			y: null, // The Y coordinate of the mouse pointer relative to the whole document
		},
		
		global: {
			x: null, // The X coordinate of the mouse pointer in global (screen) coordinates
			y: null, // The Y coordinate of the mouse pointer in global (screen) coordinates
		},
	
		previousGlobalOffset: {
			// currentEvent.movementX = currentEvent.screenX - previousEvent.screenX.
			x: null, // The X coordinate of the mouse pointer relative to the position of the last mousemove event
			y: null, // The Y coordinate of the mouse pointer relative to the position of the last mousemove event
		},
	},

	relatedEmitter: null, // The secondary target for the event, if there is one
	relatedEmitterDomNode: null, // The secondary target DOM node for the event, if there is one

	clickCount: null, // The number of clicks that happened in a short amount of time in the same area

	device: {
		capabilities: {
			touch: null,
		},
	},

});

// Static methods

MouseEvent.is = function(value) {
	return Class.isInstance(value, MouseEvent);
};

MouseEvent.createFromDomEvent = function(domMouseEvent, emitter, identifier, data, options) {
	var mouseEvent = new MouseEvent(emitter, identifier, data, options);

	mouseEvent.type = domMouseEvent.type;

	mouseEvent.keyboardKeysDown.alt = domMouseEvent.altKey;
	mouseEvent.keyboardKeysDown.ctrl = domMouseEvent.ctrlKey;
	mouseEvent.keyboardKeysDown.meta = domMouseEvent.metaKey;
	mouseEvent.keyboardKeysDown.shift = domMouseEvent.shiftKey;

	mouseEvent.mouseButtonsDown = {
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
	};
	var mouseButtonsDownMap = {
		1: 1,
		2: 2,
		4: 3,
		8: 4,
		16: 5,
	};
	if(domMouseEvent.buttons) {
		mouseButtonsDownMap.each(function(key, value) {
			// If the "bit and" operation is not 0, then the button is pressed
			if(key & domMouseEvent.buttons) {
				mouseEvent.mouseButtonsDown[value] = true;
			}
		});
	}
	//Console.standardWarn(domMouseEvent.buttons, mouseEvent.mouseButtonsDown);

	// Remap buttons to make sense
	if(domMouseEvent.button == 0) { // domMouseEvent.button 0: Main button pressed, usually the left button or the un-initialized state	
		mouseEvent.button = 1;
	}
	else if(domMouseEvent.button == 1) { // domMouseEvent.button 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
		mouseEvent.button = 3;
	}
	else if(domMouseEvent.button == 2) { // domMouseEvent.button 2: Secondary button pressed, usually the right button
		mouseEvent.button = 2;
	}
	else if(domMouseEvent.button == 3) { // domMouseEvent.button 3: Fourth button, typically the Browser Back button
		mouseEvent.button = 4;
	}
	else if(domMouseEvent.button == 4) { // domMouseEvent.button 4: Fifth button, typically the Browser Forward button
		mouseEvent.button = 5;
	}

	mouseEvent.offsets.emitter.x = domMouseEvent.offsetX;
	mouseEvent.offsets.emitter.y = domMouseEvent.offsetY;
	mouseEvent.offsets.relativeAncestor.x = domMouseEvent.layerX;
	mouseEvent.offsets.relativeAncestor.y = domMouseEvent.layerY;
	mouseEvent.offsets.viewport.x = domMouseEvent.x;
	mouseEvent.offsets.viewport.y = domMouseEvent.y;
	mouseEvent.offsets.document.x = domMouseEvent.pageX;
	mouseEvent.offsets.document.y = domMouseEvent.pageY;
	mouseEvent.offsets.global.x = domMouseEvent.screenX;
	mouseEvent.offsets.global.y = domMouseEvent.screenY;
	mouseEvent.offsets.previousGlobalOffset.x = domMouseEvent.movementX;
	mouseEvent.offsets.previousGlobalOffset.y = domMouseEvent.movementY;
	//console.log(mouseEvent.offsets);

	if(domMouseEvent.relatedTarget && domMouseEvent.relatedTarget.htmlNode) {
		mouseEvent.relatedEmitter = domMouseEvent.relatedTarget.htmlNode; // .htmlNode is set in HtmlNode.mountedToDom()	
	}
	mouseEvent.relatedEmitterDomNode = domMouseEvent.relatedTarget;

	mouseEvent.clickCount = domMouseEvent.detail;

	var touch = false;
	if(domMouseEvent.sourceCapabilities) {
		if(domMouseEvent.sourceCapabilities.firesTouchEvents) {
			touch = true;
		}
	}
	mouseEvent.device.capabilities.touch = touch;

	return mouseEvent;
};

// Export
module.exports = MouseEvent;