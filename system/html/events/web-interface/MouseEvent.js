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

MouseEvent.createEventsFromDomEvent = function(domEvent, emitter) {
	Console.standardLog('MouseEvent.createEventsFromDomEvent arguments', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var mouseEventWithoutIdentifier = MouseEvent.createFromDomEvent(domEvent, emitter, null);

	var clickCountMap = {
		1: 'single',
		2: 'double',
		3: 'triple',
		4: 'quadruple',
	};

	var eventIdentifier = 'mouse.button.'+mouseEventWithoutIdentifier.button+'.'+domEvent.type.replace('mouse', '');

	events.append(MouseEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));

	// Figure out other events to create

	// interact events are fired on mouse.button.1.click
	if(mouseEventWithoutIdentifier.button == 1) {
		events.append(MouseEvent.createFromDomEvent(domEvent, emitter, 'interact'));
	}
	// mouse.button.2.click events are fired on mouseup
	else if(mouseEventWithoutIdentifier.button == 2 && domEvent.type == 'mouseup') {
		events.append(MouseEvent.createFromDomEvent(domEvent, emitter, 'mouse.button.2.click'));

		// Fire clickCount events for mouse 2
		if(clickCountMap[mouseEventWithoutIdentifier.clickCount]) {
			events.append(MouseEvent.createFromDomEvent(domEvent, emitter, 'mouse.button.2.click.'+clickCountMap[mouseEventWithoutIdentifier.clickCount]));
		}
	}

	// Emit additional mouse.wheel. events in addition to mouse.button.3.
	if(mouseEventWithoutIdentifier.button == 3) {
		var wheelClickEventIdentifier = eventIdentifier.replace('button.3', 'wheel');
		events.append(MouseEvent.createFromDomEvent(domEvent, emitter, wheelClickEventIdentifier));
	}

	// Conditionally fire another event for clickCount (this covers everything but mouse button 2)
	if(domEvent.type == 'click' && clickCountMap[mouseEventWithoutIdentifier.clickCount]) {
		eventIdentifier = eventIdentifier+'.'+clickCountMap[mouseEventWithoutIdentifier.clickCount];
		events.append(MouseEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));

		// Emit additional mouse.wheel. events in addition to mouse.button.3.
		if(mouseEventWithoutIdentifier.button == 3) {
			eventIdentifier = eventIdentifier.replace('button.3', 'wheel');
			events.append(MouseEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
		}
	}

	Console.standardLog('MouseEvent.createEventsFromDomEvent events', events);

	return events;
};

MouseEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var mouseEvent = new MouseEvent(emitter, identifier);

	MouseEvent.initializeFromDomEvent(mouseEvent, domEvent);

	return mouseEvent;
};

MouseEvent.initializeFromDomEvent = function(mouseEvent, domEvent) {
	mouseEvent.modifierKeysDown.alt = domEvent.altKey;
	mouseEvent.modifierKeysDown.control = domEvent.ctrlKey;
	mouseEvent.modifierKeysDown.meta = domEvent.metaKey;
	mouseEvent.modifierKeysDown.shift = domEvent.shiftKey;

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
	if(domEvent.buttons) {
		mouseButtonsDownMap.each(function(key, value) {
			// If the "bit and" operation is not 0, then the button is pressed
			if(key & domEvent.buttons) {
				mouseEvent.mouseButtonsDown[value] = true;
			}
		});
	}
	//Console.standardWarn(domEvent.buttons, mouseEvent.mouseButtonsDown);

	// Remap buttons to make sense
	if(domEvent.button == 0) { // domEvent.button 0: Main button pressed, usually the left button or the un-initialized state	
		mouseEvent.button = 1;
	}
	else if(domEvent.button == 1) { // domEvent.button 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
		mouseEvent.button = 3;
	}
	else if(domEvent.button == 2) { // domEvent.button 2: Secondary button pressed, usually the right button
		mouseEvent.button = 2;
	}
	else if(domEvent.button == 3) { // domEvent.button 3: Fourth button, typically the Browser Back button
		mouseEvent.button = 4;
	}
	else if(domEvent.button == 4) { // domEvent.button 4: Fifth button, typically the Browser Forward button
		mouseEvent.button = 5;
	}

	mouseEvent.position.relativeToEmitter.x = domEvent.offsetX;
	mouseEvent.position.relativeToEmitter.y = domEvent.offsetY;
	mouseEvent.position.relativeToRelativeAncestor.x = domEvent.layerX;
	mouseEvent.position.relativeToRelativeAncestor.y = domEvent.layerY;
	mouseEvent.position.relativeToDocumentViewport.x = domEvent.x;
	mouseEvent.position.relativeToDocumentViewport.y = domEvent.y;
	mouseEvent.position.relativeToDocument.x = domEvent.pageX;
	mouseEvent.position.relativeToDocument.y = domEvent.pageY;
	mouseEvent.position.relativeToGlobal.x = domEvent.screenX;
	mouseEvent.position.relativeToGlobal.y = domEvent.screenY;
	mouseEvent.position.relativeToPreviousGlobalRelativePosition.x = domEvent.movementX;
	mouseEvent.position.relativeToPreviousGlobalRelativePosition.y = domEvent.movementY;
	//console.log(mouseEvent.position);

	if(domEvent.relatedTarget && domEvent.relatedTarget.htmlNode) {
		mouseEvent.relatedEmitter = domEvent.relatedTarget.htmlNode; // .htmlNode is set in HtmlNode.mountedToDom()	
	}
	mouseEvent.relatedEmitterDomNode = domEvent.relatedTarget;

	mouseEvent.clickCount = domEvent.detail;

	return mouseEvent;
};

// Export
module.exports = MouseEvent;