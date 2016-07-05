// Dependencies
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var MouseEvent = HtmlElementEvent.extend({

	// Keyboard keys down when the mouse event was emitted
	modifierKeysDown: {
		alt: null, // true if the alt key was down when the mouse event was emitted
		control: null, // true if the control key was down when the mouse event was emitted
		// meta is the Command key on macOS keyboards or Windows key on Windows keyboards
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

	position: {
		relativeToEmitter: {
			x: null, // The X coordinate of the mouse pointer relative to the position of the padding edge of the target node
			y: null, // The Y coordinate of the mouse pointer relative to the position of the padding edge of the target node
		},

		relativeToRelativeAncestor: {
			x: null, // The X coordinate of the mouse pointer relative to the closest positioned ancestor element
			y: null, // The Y coordinate of the mouse pointer relative to the closest positioned ancestor element
		},

		relativeToDocumentViewport: {
			x: null, // The X coordinate of the mouse pointer in local (DOM content) coordinates
			y: null, // The Y coordinate of the mouse pointer in local (DOM content) coordinates
		},

		relativeToDocument: {
			x: null, // The X coordinate of the mouse pointer relative to the whole document
			y: null, // The Y coordinate of the mouse pointer relative to the whole document
		},
		
		relativeToGlobal: {
			x: null, // The X coordinate of the mouse pointer in global (screen) coordinates
			y: null, // The Y coordinate of the mouse pointer in global (screen) coordinates
		},
	
		relativeToPreviousGlobalRelativePosition: {
			// currentEvent.movementX = currentEvent.screenX - previousEvent.screenX.
			x: null, // The X coordinate of the mouse pointer relative to the position of the last mousemove event
			y: null, // The Y coordinate of the mouse pointer relative to the position of the last mousemove event
		},
	},

	relatedEmitter: null, // The secondary target for the event, if there is one
	relatedEmitterDomNode: null, // The secondary target DOM node for the event, if there is one

	clickCount: null, // The number of clicks that happened in a short amount of time in the same area

});

// Static methods

MouseEvent.is = function(value) {
	return Class.isInstance(value, MouseEvent);
};

MouseEvent.createEventsFromDomEvent = function(domMouseEvent, emitter, data, options) {
	Console.standardLog('MouseEvent.createEventsFromDomEvent arguments', domMouseEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var mouseEventWithoutIdentifier = MouseEvent.createFromDomEvent(domMouseEvent, emitter, null, data, options);

	var clickCountMap = {
		1: 'single',
		2: 'double',
		3: 'triple',
		4: 'quadruple',
	};

	var eventIdentifier = 'mouse.button.'+mouseEventWithoutIdentifier.button+'.'+domMouseEvent.type.replace('mouse', '');

	events.append(MouseEvent.createFromDomEvent(domMouseEvent, emitter, eventIdentifier, data, options));

	// Figure out other events to create

	// interact events are fired on mouse.button.1.click
	if(mouseEventWithoutIdentifier.button == 1) {
		events.append(MouseEvent.createFromDomEvent(domMouseEvent, emitter, 'interact', data, options));
	}
	// mouse.button.2.click events are fired on mouseup
	else if(mouseEventWithoutIdentifier.button == 2 && domMouseEvent.type == 'mouseup') {
		events.append(MouseEvent.createFromDomEvent(domMouseEvent, emitter, 'mouse.button.2.click', data, options));

		// Fire clickCount events for mouse 2
		if(clickCountMap[mouseEventWithoutIdentifier.clickCount]) {
			events.append(MouseEvent.createFromDomEvent(domMouseEvent, emitter, 'mouse.button.2.click.'+clickCountMap[mouseEventWithoutIdentifier.clickCount], data, options));
		}
	}

	// Conditionally fire another event for clickCount (this covers everything but mouse button 2)
	if(domMouseEvent.type == 'click' && clickCountMap[mouseEventWithoutIdentifier.clickCount]) {
		eventIdentifier = eventIdentifier+'.'+clickCountMap[mouseEventWithoutIdentifier.clickCount];
		events.append(MouseEvent.createFromDomEvent(domMouseEvent, emitter, eventIdentifier, data, options));
	}

	Console.standardLog('MouseEvent.createEventsFromDomEvent events', events);

	return events;
};

MouseEvent.createFromDomEvent = function(domMouseEvent, emitter, identifier, data, options) {
	var mouseEvent = new MouseEvent(emitter, identifier, data, options);

	mouseEvent.modifierKeysDown.alt = domMouseEvent.altKey;
	mouseEvent.modifierKeysDown.control = domMouseEvent.ctrlKey;
	mouseEvent.modifierKeysDown.meta = domMouseEvent.metaKey;
	mouseEvent.modifierKeysDown.shift = domMouseEvent.shiftKey;

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

	mouseEvent.position.relativeToEmitter.x = domMouseEvent.offsetX;
	mouseEvent.position.relativeToEmitter.y = domMouseEvent.offsetY;
	mouseEvent.position.relativeToRelativeAncestor.x = domMouseEvent.layerX;
	mouseEvent.position.relativeToRelativeAncestor.y = domMouseEvent.layerY;
	mouseEvent.position.relativeToDocumentViewport.x = domMouseEvent.x;
	mouseEvent.position.relativeToDocumentViewport.y = domMouseEvent.y;
	mouseEvent.position.relativeToDocument.x = domMouseEvent.pageX;
	mouseEvent.position.relativeToDocument.y = domMouseEvent.pageY;
	mouseEvent.position.relativeToGlobal.x = domMouseEvent.screenX;
	mouseEvent.position.relativeToGlobal.y = domMouseEvent.screenY;
	mouseEvent.position.relativeToPreviousGlobalRelativePosition.x = domMouseEvent.movementX;
	mouseEvent.position.relativeToPreviousGlobalRelativePosition.y = domMouseEvent.movementY;
	//console.log(mouseEvent.position);

	if(domMouseEvent.relatedTarget && domMouseEvent.relatedTarget.htmlNode) {
		mouseEvent.relatedEmitter = domMouseEvent.relatedTarget.htmlNode; // .htmlNode is set in HtmlNode.mountedToDom()	
	}
	mouseEvent.relatedEmitterDomNode = domMouseEvent.relatedTarget;

	mouseEvent.clickCount = domMouseEvent.detail;

	return mouseEvent;
};

// Export
module.exports = MouseEvent;