// Dependencies
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var InputPressEvent = HtmlElementEvent.extend({

	// Keyboard keys down when the mouse event was emitted
	modifierKeysDown: {
		alt: null, // true if the alt key was down when the mouse event was emitted
		control: null, // true if the control key was down when the mouse event was emitted
		// meta is the Command key on macOS keyboards or Windows key on Windows keyboards
		meta: null, // true if the meta key was down when the mouse event was emitted
		shift: null, // true if the shift key was down when the mouse event was emitted
	},

	// InputPress buttons down when the mouse event was emitted
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

InputPressEvent.is = function(value) {
	return Class.isInstance(value, InputPressEvent);
};

InputPressEvent.createEventsFromDomEvent = function(domEvent, emitter) {
	Console.standardLog('InputPressEvent.createEventsFromDomEvent arguments', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var inputPressEventWithoutIdentifier = InputPressEvent.createFromDomEvent(domEvent, emitter, null);

	var clickCountMap = {
		1: 'single',
		2: 'double',
		3: 'triple',
		4: 'quadruple',
	};

	var eventIdentifier = 'mouse.button.'+inputPressEventWithoutIdentifier.button+'.'+domEvent.type.replace('mouse', '');

	events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));

	// Figure out other events to create

	// interact events are fired on mouse.button.1.click
	if(inputPressEventWithoutIdentifier.button == 1) {
		events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, 'interact'));
	}
	// mouse.button.2.click events are fired on mouseup
	else if(inputPressEventWithoutIdentifier.button == 2 && domEvent.type == 'mouseup') {
		events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, 'mouse.button.2.click'));

		// Fire clickCount events for mouse 2
		if(clickCountMap[inputPressEventWithoutIdentifier.clickCount]) {
			events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, 'mouse.button.2.click.'+clickCountMap[inputPressEventWithoutIdentifier.clickCount]));
		}
	}

	// Emit additional mouse.wheel. events in addition to mouse.button.3.
	if(inputPressEventWithoutIdentifier.button == 3) {
		var wheelClickEventIdentifier = eventIdentifier.replace('button.3', 'wheel');
		events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, wheelClickEventIdentifier));
	}

	// Conditionally fire another event for clickCount (this covers everything but mouse button 2)
	if(domEvent.type == 'click' && clickCountMap[inputPressEventWithoutIdentifier.clickCount]) {
		eventIdentifier = eventIdentifier+'.'+clickCountMap[inputPressEventWithoutIdentifier.clickCount];
		events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));

		// Emit additional mouse.wheel. events in addition to mouse.button.3.
		if(inputPressEventWithoutIdentifier.button == 3) {
			eventIdentifier = eventIdentifier.replace('button.3', 'wheel');
			events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
		}
	}

	Console.standardLog('InputPressEvent.createEventsFromDomEvent events', events);

	return events;
};

InputPressEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var inputPressEvent = new InputPressEvent(emitter, identifier);

	InputPressEvent.initializeFromDomEvent(inputPressEvent, domEvent);

	return inputPressEvent;
};

InputPressEvent.initializeFromDomEvent = function(inputPressEvent, domEvent) {
	inputPressEvent.modifierKeysDown.alt = domEvent.altKey;
	inputPressEvent.modifierKeysDown.control = domEvent.ctrlKey;
	inputPressEvent.modifierKeysDown.meta = domEvent.metaKey;
	inputPressEvent.modifierKeysDown.shift = domEvent.shiftKey;

	inputPressEvent.mouseButtonsDown = {
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
				inputPressEvent.mouseButtonsDown[value] = true;
			}
		});
	}
	//Console.standardWarn(domEvent.buttons, inputPressEvent.mouseButtonsDown);

	// Remap buttons to make sense
	if(domEvent.button == 0) { // domEvent.button 0: Main button pressed, usually the left button or the un-initialized state	
		inputPressEvent.button = 1;
	}
	else if(domEvent.button == 1) { // domEvent.button 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
		inputPressEvent.button = 3;
	}
	else if(domEvent.button == 2) { // domEvent.button 2: Secondary button pressed, usually the right button
		inputPressEvent.button = 2;
	}
	else if(domEvent.button == 3) { // domEvent.button 3: Fourth button, typically the Browser Back button
		inputPressEvent.button = 4;
	}
	else if(domEvent.button == 4) { // domEvent.button 4: Fifth button, typically the Browser Forward button
		inputPressEvent.button = 5;
	}

	inputPressEvent.position.relativeToEmitter.x = domEvent.offsetX;
	inputPressEvent.position.relativeToEmitter.y = domEvent.offsetY;
	inputPressEvent.position.relativeToRelativeAncestor.x = domEvent.layerX;
	inputPressEvent.position.relativeToRelativeAncestor.y = domEvent.layerY;
	inputPressEvent.position.relativeToDocumentViewport.x = domEvent.x;
	inputPressEvent.position.relativeToDocumentViewport.y = domEvent.y;
	inputPressEvent.position.relativeToDocument.x = domEvent.pageX;
	inputPressEvent.position.relativeToDocument.y = domEvent.pageY;
	inputPressEvent.position.relativeToGlobal.x = domEvent.screenX;
	inputPressEvent.position.relativeToGlobal.y = domEvent.screenY;
	inputPressEvent.position.relativeToPreviousGlobalRelativePosition.x = domEvent.movementX;
	inputPressEvent.position.relativeToPreviousGlobalRelativePosition.y = domEvent.movementY;
	//console.log(inputPressEvent.position);

	if(domEvent.relatedTarget && domEvent.relatedTarget.htmlNode) {
		inputPressEvent.relatedEmitter = domEvent.relatedTarget.htmlNode; // .htmlNode is set in HtmlNode.mountedToDom()	
	}
	inputPressEvent.relatedEmitterDomNode = domEvent.relatedTarget;

	inputPressEvent.clickCount = domEvent.detail;

	return inputPressEvent;
};

// Export
module.exports = InputPressEvent;