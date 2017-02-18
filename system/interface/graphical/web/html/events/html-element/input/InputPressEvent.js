// Dependencies
import HtmlElementEvent from 'framework/system/interface/graphical/web/html/events/html-element/HtmlElementEvent.js';

// Class
class InputPressEvent extends HtmlElementEvent {

	// Keyboard keys down when the mouse event was emitted
	modifierKeysDown = {
		alt: null, // true if the alt key was down when the mouse event was emitted
		control: null, // true if the control key was down when the mouse event was emitted
		// meta is the Command key on macOS keyboards or Windows key on Windows keyboards
		meta: null, // true if the meta key was down when the mouse event was emitted
		shift: null, // true if the shift key was down when the mouse event was emitted
	};

	// InputPress buttons down when the mouse event was emitted
	buttonsDown = {
		1: null,
		2: null,
		3: null,
		4: null,
		5: null,
	};

	// The button number that was pressed when the mouse event was emitted
	// 1: Main button pressed, usually the left button or the un-initialized state
	// 2: Secondary button pressed, usually the right button
	// 3: Auxiliary button pressed, usually the wheel button or the middle button (if present)
	// 4: Fourth button, typically the Browser Back button
	// 5: Fifth button, typically the Browser Forward button
	button = null;

	position = {
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
	};

	relatedEmitter = null; // The secondary target for the event, if there is one
	relatedEmitterDomNode = null; // The secondary target DOM node for the event, if there is one

	pressCount = null; // The number of clicks that happened in a short amount of time in the same area

	static is(value) {
		return Class.isInstance(value, InputPressEvent);
	}

	static createEventsFromDomEvent(domEvent, emitter) {
		//console.info('InputPressEvent.createEventsFromDomEvent arguments', domEvent.type, arguments);

		var events = [];

		// Use this for identifying which events to create
		var inputPressEventWithoutIdentifier = InputPressEvent.createFromDomEvent(domEvent, emitter, null);

		var pressCountMap = {
			2: 'double',
			3: 'triple',
			4: 'quadruple',
		};

		var buttonMap = {
			2: 'secondary', // right-click and two-finger tap
			3: 'tertiary', // middle-click and three-finger tap
			4: 'quarternary', // mouse button 4 and four-finger tap
			5: 'quinary', // mouse button 5 and five-finger tap
		};

		var eventTypeSuffix = '.'+domEvent.type.replace('mouse', '');
		var eventIdentifier = null;

		if(eventTypeSuffix == '.click') {
			eventTypeSuffix = '';
		}

		if(inputPressEventWithoutIdentifier.button == 1) {
			eventIdentifier = 'input.press'+eventTypeSuffix;
			events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
		}
		
		if(buttonMap[inputPressEventWithoutIdentifier.button]) {
			eventIdentifier = 'input.press.'+buttonMap[inputPressEventWithoutIdentifier.button]+eventTypeSuffix;
			events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));	
		}

		// input.press.secondary.click events have to be manually fired on mouseup
		if(inputPressEventWithoutIdentifier.button == 2 && domEvent.type == 'mouseup') {
			events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, 'input.press.secondary'));

			// Fire pressCount events for mouse 2
			if(pressCountMap[inputPressEventWithoutIdentifier.pressCount]) {
				events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, 'input.press.secondary.'+pressCountMap[inputPressEventWithoutIdentifier.pressCount]));
			}
		}

		// input.press.tertiary.click events have to be manually fired on mouseup
		if(inputPressEventWithoutIdentifier.button == 3 && domEvent.type == 'mouseup') {
			events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, 'input.press.tertiary'));

			// Fire pressCount events for mouse 2
			if(pressCountMap[inputPressEventWithoutIdentifier.pressCount]) {
				events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, 'input.press.tertiary.'+pressCountMap[inputPressEventWithoutIdentifier.pressCount]));
			}
		}

		// Conditionally fire another event for pressCount (this covers everything but mouse button 2 and 3)
		if(domEvent.type == 'click' && pressCountMap[inputPressEventWithoutIdentifier.pressCount]) {
			eventIdentifier = eventIdentifier+'.'+pressCountMap[inputPressEventWithoutIdentifier.pressCount];
			events.append(InputPressEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
		}

		//console.log('InputPressEvent.createEventsFromDomEvent events', events);

		return events;
	}

	static createFromDomEvent(domEvent, emitter, identifier) {
		var inputPressEvent = new InputPressEvent(emitter, identifier);

		InputPressEvent.initializeFromDomEvent(inputPressEvent, domEvent);

		return inputPressEvent;
	}

	static initializeFromDomEvent(inputPressEvent, domEvent) {
		inputPressEvent.modifierKeysDown.alt = domEvent.altKey;
		inputPressEvent.modifierKeysDown.command = domEvent.metaKey;
		inputPressEvent.modifierKeysDown.control = domEvent.ctrlKey;
		inputPressEvent.modifierKeysDown.shift = domEvent.shiftKey;
		inputPressEvent.modifierKeysDown.windows = domEvent.metaKey;

		inputPressEvent.buttonsDown = {
			1: false,
			2: false,
			3: false,
			4: false,
			5: false,
		};
		var buttonsDownMap = {
			1: 1,
			2: 2,
			4: 3,
			8: 4,
			16: 5,
		};
		if(domEvent.buttons) {
			buttonsDownMap.each(function(key, value) {
				// If the "bit and" operation is not 0, then the button is pressed
				if(key & domEvent.buttons) {
					inputPressEvent.buttonsDown[value] = true;
				}
			});
		}
		//console.warn(domEvent.buttons, inputPressEvent.buttonsDown);

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

		inputPressEvent.pressCount = domEvent.detail;

		return inputPressEvent;
	}

}

// Export
export default InputPressEvent;
