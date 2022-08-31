// Dependencies
import { StandardStream } from '@framework/system/stream/StandardStream.js';
import { StandardInputEventManager } from '@framework/system/stream/events/StandardInputEventManager.js';
import { StandardInputKeyEvent } from '@framework/system/stream/events/StandardInputKeyEvent.js';
import { StandardInputPressEvent } from '@framework/system/stream/events/StandardInputPressEvent.js';
import { StandardInputHoverEvent } from '@framework/system/stream/events/StandardInputHoverEvent.js';
import { StandardInputDragEvent } from '@framework/system/stream/events/StandardInputDragEvent.js';
import { StandardInputScrollEvent } from '@framework/system/stream/events/StandardInputScrollEvent.js';
import { InputKeyEvent } from '@framework/system/interface/graphical/web/html/events/html-element/input/InputKeyEvent.js';

// Class
class StandardInputStream extends StandardStream {

	nodeStream = Node.Process.stdin;
	nodeStreamStandardWrite = Node.Process.stdin.write;
	eventManager = new StandardInputEventManager(this);
	mouseInputEventsEnabled = false;
	emitDataOnStandardOutputStream = true;

	constructor() {
		super();

		this.setEncoding('utf8');
		this.setRawMode(true); // Read characters not lines

		// Do not enable mouse input events by default, apps must choose to do this
		// and need to call disableMouseInputEvents on app.exit()
		// this.enableMouseInputEvents(); 

		// When we receive data from the stream
		this.nodeStream.on('data', function(data) {
			// Process the data and emit events
			this.processDataAndEmitEvents(data);
		}.bind(this));
	}

	setEncoding(encoding) {
		this.nodeStream.setEncoding(encoding);
	}

	setRawMode(enabled) {
		var set = false;

		// Raw mode takes input character by character rather than line by line
		if(this.nodeStream.setRawMode) {
			this.nodeStream.setRawMode(enabled);
			set = true;
		}

		return set;
	}

	enableEmittingDataOnStandardOutputStream() {
		this.emitDataOnStandardOutputStream = true;
	}

	disableEmittingDataOnStandardOutputStream() {
		this.emitDataOnStandardOutputStream = false;
	}

	enableMouseInputEvents() {
		this.mouseInputEventsEnabled = true;

		// Write a special code to standard out which will cause the terminal to start emitting mouse event codes
		// https://stackoverflow.com/questions/5966903/how-to-get-mousemove-and-mouseclick-in-bash
		Node.Process.stdout.write('\x1b[?1003h');

		// Then, request urxvt 1015 mode, because 1003 mode can only handle coordinates 95 (127 - 32)
		Node.Process.stdout.write('\x1b[?1015h');

		// Lastly, enable 1006 mode for compatibility		
		Node.Process.stdout.write('\x1b[?1006h');
	}

	disableMouseInputEvents() {
		this.mouseInputEventsEnabled = false;

		// Disable mouse trapping
		Node.Process.stdout.write('\x1b[?1000l');
	}

	processDataAndEmitEvents(data) {
		// Handle mouse input events, they always start with '\x1b' 
		// \1xb (hex) is the same as \u001b (unicode)
		if(this.mouseInputEventsEnabled && data.startsWith('\x1b')) {
			// Sometimes multiple mouse input codes come in a single data chunk
			// So, we always split the data into an array of mouse input codes
			const mouseInputEventCodes = data.split('\x1b'+'[<');
			// console.log(mouseInputEventCodes);
			
			// Loop through each mouse input code and handle it
			mouseInputEventCodes.each(function(mouseInputEventCodeIndex, mouseInputEventCode) {
				// console.log(mouseInputEventCode);

				// Make sure we are working with a mouse specific code
				if(
					mouseInputEventCode !== '' && // Make sure the code is not an empty string
					(mouseInputEventCode.endsWith('M') || mouseInputEventCode.endsWith('m')) // And the code ends with an M or m
				) {
					let mouseInputEventCodeParts = this.handleMouseInputEventCode(mouseInputEventCode);
					let mouseInputEvent = this.createMouseInputEventFromCodeParts(mouseInputEventCodeParts);
					this.emit(mouseInputEvent.identifier, mouseInputEvent);
				}
			}.bind(this));
		}
		// Handle key input events
		else {
			// Emit input.key.* events
			this.emitKeyboardInputEventFromData(data);

			// Emit a data event on standard out if enabled
			if(this.emitDataOnStandardOutputStream) {
				this.emit('data', data);
			}
			// If we are blocking data events on standard out, we still need to allow ctrl+c (SIGINT)
			else if(data === '\x03') {
				this.emit('data', data);
			}
		}
	}

	handleMouseInputEventCode(mouseInputEventCode) {
		// console.log('mouseInputEventCode:', Json.encode(mouseInputEventCode));

		// Split the code into parts
		const mouseInputEventCodePartsArray = mouseInputEventCode.substring(0, mouseInputEventCode.length - 1).split(';');
		// console.log('mouseInputEventCodePartsArray', mouseInputEventCodePartsArray);

		// Get the code
		let code = Number.toInteger(mouseInputEventCodePartsArray[0]);

		// Create the parts from the raw binary data from the code
		var mouseInputEventCodeParts = {
			button: code & 0x3, // Bits 1-2
			shiftDown: !!(1<<2 & code), // Bit 3
			altDown: !!(1<<3 & code), // Bit 4
			controlDown: !!(1<<4 & code), // Bit 5
			move: !!(1<<5 & code), // Bit 6
			scroll: !!(1<<6 & code), // Bit 7,
			boolean: mouseInputEventCode.endsWith('M'),
			x: Number.toInteger(mouseInputEventCodePartsArray[1]),
			y: Number.toInteger(mouseInputEventCodePartsArray[2]),
		};

		// console.log(mouseInputEventCodeParts);

		return mouseInputEventCodeParts;
	}

	createMouseInputEventFromCodeParts(mouseInputEventCodeParts) {
		// Determine which event we are going to fire
		let mouseInputEvent = null;

		// Scrolling
		if(mouseInputEventCodeParts.scroll) {
			mouseInputEvent = new StandardInputScrollEvent();
		}
		// Dragging
		else if(mouseInputEventCodeParts.move && mouseInputEventCodeParts.button !== 3) {
			mouseInputEvent = new StandardInputDragEvent();
		}
		// Moving
		else if(mouseInputEventCodeParts.move) {
			mouseInputEvent = new StandardInputHoverEvent();
		}
		// Pressing
		else {
			// Use a press event
			mouseInputEvent = new StandardInputPressEvent();
		}

		// Modifier keys down
		mouseInputEvent.modifierKeysDown.alt = mouseInputEventCodeParts.altDown, // true if the alt key was down when the mouse event was emitted
		mouseInputEvent.modifierKeysDown.control = mouseInputEventCodeParts.controlDown, // true if the control key was down when the mouse event was emitted
		mouseInputEvent.modifierKeysDown.shift = mouseInputEventCodeParts.shiftDown, // true if the shift key was down when the mouse event was emitted

		// Position
		mouseInputEvent.position.x = mouseInputEventCodeParts.x;
		mouseInputEvent.position.y = mouseInputEventCodeParts.y;

		// Parse which button is involved in the event
		if(mouseInputEventCodeParts.button == 0x0) {
			mouseInputEvent.button = 1;
		}
		else if(mouseInputEventCodeParts.button == 0x1) {
			mouseInputEvent.button = 3;
		}
		else if(mouseInputEventCodeParts.button == 0x2) {
			mouseInputEvent.button = 2;
		}

		// Scroll events
		if(mouseInputEventCodeParts.scroll) {
			if(mouseInputEventCodeParts.button == 0x0) {
				mouseInputEvent.direction = 'up';
				mouseInputEvent.identifier = 'input.scroll.up';
			}
			else {
				mouseInputEvent.direction = 'down';
				mouseInputEvent.identifier = 'input.scroll.down';
			}

			// Clear event.button
			mouseInputEvent.button = null;
		}
		// Drag events
		else if(mouseInputEventCodeParts.move && mouseInputEventCodeParts.button !== 3) {
			mouseInputEvent.identifier = 'input.drag';
		}
		// Move events
		else if(mouseInputEventCodeParts.move) {
			mouseInputEvent.identifier = 'input.hover';
		}
		// Press events
		else {
			mouseInputEvent.identifier = 'input.press';

			// Handle button presses which aren't the first button on the mouse
			if(mouseInputEvent.button !== 1) {
				mouseInputEvent.identifier += '.'+StandardInputPressEvent.buttonMap[mouseInputEvent.button];
			}

			// Handle down and up states
			if(mouseInputEventCodeParts.boolean) {
				mouseInputEvent.identifier += '.down';
			}
			else {
				mouseInputEvent.identifier += '.up';
			}
		}
		
		return mouseInputEvent;
	}

	emitKeyboardInputEventFromData(data) {
		// console.log('data', data);

		let keyboardInputEvent = new StandardInputKeyEvent();
		keyboardInputEvent.identifier = 'input.key';
		keyboardInputEvent.data = data;
		let parts = null;

		// // If the data is a buffer, convert it to a string
		// if(Buffer.isBuffer(data)) {
		// 	if(data[0] > 127 && data[1] === undefined) {
		// 		data[0] -= 128;
		// 		data = '\x1b' + data.toString(this.nodeStream.encoding || 'utf-8');
		// 	}
		// 	else {
		// 		data = data.toString(this.nodeStream.encoding || 'utf-8');
		// 	}
		// }

		// Carriage return
		if(data === '\r') {
    		keyboardInputEvent.key = 'enter';
  		}
		// Enter, should have been called linefeed
  		else if(data === '\n') {
    		keyboardInputEvent.key = 'enter';
  		}
		// Tab
  		else if(data === '\t') {
    		keyboardInputEvent.key = 'tab';
  		}
		// Backspace or ctrl+h
  		else if(data === '\b' || data === '\x7f' || data === '\x1b\x7f' || data === '\x1b\b') {
    		keyboardInputEvent.key = 'backspace';
    		keyboardInputEvent.modifierKeysDown.meta = (data.charAt(0) === '\x1b');
  		}
		// Escape
		else if(data === '\x1b' || data === '\x1b\x1b') {
    		keyboardInputEvent.key = 'escape';
    		keyboardInputEvent.modifierKeysDown.meta = (data.length === 2);
		}
		// Space
		else if(data === ' ' || data === '\x1b ') {
			keyboardInputEvent.key = 'space';
			keyboardInputEvent.modifierKeysDown.meta = (data.length === 2);
		}
		// Ctrl + character
		else if(data <= '\x1a') {
			keyboardInputEvent.key = String.fromCharCode(data.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
			keyboardInputEvent.modifierKeysDown.control = true;
		}
		// Shift + character
		else if(data.length === 1 && data >= 'A' && data <= 'Z') {
			keyboardInputEvent.key = data;
			keyboardInputEvent.modifierKeysDown.shift = true;
		}
		// Lowercase character
		else if(data.length === 1 && data >= 'a' && data <= 'z') {
			keyboardInputEvent.key = data;
		}
		else if(data.length === 1) {
			let keyTitle = InputKeyEvent.keyTitleMap[data];
			if(keyTitle) {
				keyboardInputEvent.key = keyTitle;
			}
			else {
				keyboardInputEvent.key = data;
			}
		}
		// Meta + character 
		else if(parts = StandardInputStream.metaKeyCodeRegularExpression.exec(data)) {
			keyboardInputEvent.key = parts[1].toLowerCase();
			keyboardInputEvent.modifierKeysDown.meta = true;
			keyboardInputEvent.modifierKeysDown.shift = /^[A-Z]$/.test(parts[1]);
		}
		// ANSI escape sequence
		else if(parts = StandardInputStream.functionKeyCodeRegularExpression.exec(data)) {
			// Reassemble the key code leaving out leading \x1b's, the modifier key bitflag and any meaningless '1;' sequence
			let code = (parts[1] || '') + (parts[2] || '') + (parts[4] || '') + (parts[6] || '');
			let modifier = (parts[3] || parts[5] || 1) - 1;

			// Parse the key modifier
			keyboardInputEvent.modifierKeysDown.control = !!(modifier & 4);
			keyboardInputEvent.modifierKeysDown.meta = !!(modifier & 10);
			keyboardInputEvent.modifierKeysDown.shift = !!(modifier & 1);
			keyboardInputEvent.code = code;

			// Parse the key itself
			switch(code) {
				/* xterm/gnome ESC O letter */
				case 'OP': keyboardInputEvent.key = 'f1'; break;
				case 'OQ': keyboardInputEvent.key = 'f2'; break;
				case 'OR': keyboardInputEvent.key = 'f3'; break;
				case 'OS': keyboardInputEvent.key = 'f4'; break;

				/* xterm/rxvt ESC [ number ~ */
				case '[11~': keyboardInputEvent.key = 'f1'; break;
				case '[12~': keyboardInputEvent.key = 'f2'; break;
				case '[13~': keyboardInputEvent.key = 'f3'; break;
				case '[14~': keyboardInputEvent.key = 'f4'; break;

				/* from Cygwin and used in libuv */
				case '[[A': keyboardInputEvent.key = 'f1'; break;
				case '[[B': keyboardInputEvent.key = 'f2'; break;
				case '[[C': keyboardInputEvent.key = 'f3'; break;
				case '[[D': keyboardInputEvent.key = 'f4'; break;
				case '[[E': keyboardInputEvent.key = 'f5'; break;

				/* common */
				case '[15~': keyboardInputEvent.key = 'f5'; break;
				case '[17~': keyboardInputEvent.key = 'f6'; break;
				case '[18~': keyboardInputEvent.key = 'f7'; break;
				case '[19~': keyboardInputEvent.key = 'f8'; break;
				case '[20~': keyboardInputEvent.key = 'f9'; break;
				case '[21~': keyboardInputEvent.key = 'f10'; break;
				case '[23~': keyboardInputEvent.key = 'f11'; break;
				case '[24~': keyboardInputEvent.key = 'f12'; break;

				/* xterm ESC [ letter */
				case '[A': keyboardInputEvent.key = 'up'; break;
				case '[B': keyboardInputEvent.key = 'down'; break;
				case '[C': keyboardInputEvent.key = 'right'; break;
				case '[D': keyboardInputEvent.key = 'left'; break;
				case '[E': keyboardInputEvent.key = 'clear'; break;
				case '[F': keyboardInputEvent.key = 'end'; break;
				case '[H': keyboardInputEvent.key = 'home'; break;

				/* xterm/gnome ESC O letter */
				case 'OA': keyboardInputEvent.key = 'up'; break;
				case 'OB': keyboardInputEvent.key = 'down'; break;
				case 'OC': keyboardInputEvent.key = 'right'; break;
				case 'OD': keyboardInputEvent.key = 'left'; break;
				case 'OE': keyboardInputEvent.key = 'clear'; break;
				case 'OF': keyboardInputEvent.key = 'end'; break;
				case 'OH': keyboardInputEvent.key = 'home'; break;

				/* xterm/rxvt ESC [ number ~ */
				case '[1~': keyboardInputEvent.key = 'home'; break;
				case '[2~': keyboardInputEvent.key = 'insert'; break;
				case '[3~': keyboardInputEvent.key = 'delete'; break;
				case '[4~': keyboardInputEvent.key = 'end'; break;
				case '[5~': keyboardInputEvent.key = 'pageUp'; break;
				case '[6~': keyboardInputEvent.key = 'pageDown'; break;

				/* putty */
				case '[[5~': keyboardInputEvent.key = 'pageUp'; break;
				case '[[6~': keyboardInputEvent.key = 'pageDown'; break;

				/* rxvt */
				case '[7~': keyboardInputEvent.key = 'home'; break;
				case '[8~': keyboardInputEvent.key = 'end'; break;

				/* rxvt keys with modifiers */
				case '[a': keyboardInputEvent.key = 'up'; keyboardInputEvent.modifierKeysDown.shift = true; break;
				case '[b': keyboardInputEvent.key = 'down'; keyboardInputEvent.modifierKeysDown.shift = true; break;
				case '[c': keyboardInputEvent.key = 'right'; keyboardInputEvent.modifierKeysDown.shift = true; break;
				case '[d': keyboardInputEvent.key = 'left'; keyboardInputEvent.modifierKeysDown.shift = true; break;
				case '[e': keyboardInputEvent.key = 'clear'; keyboardInputEvent.modifierKeysDown.shift = true; break;

				case '[2$': keyboardInputEvent.key = 'insert'; keyboardInputEvent.modifierKeysDown.shift = true; break;
				case '[3$': keyboardInputEvent.key = 'delete'; keyboardInputEvent.modifierKeysDown.shift = true; break;
				case '[5$': keyboardInputEvent.key = 'pageUp'; keyboardInputEvent.modifierKeysDown.shift = true; break;
				case '[6$': keyboardInputEvent.key = 'pageDown'; keyboardInputEvent.modifierKeysDown.shift = true; break;
				case '[7$': keyboardInputEvent.key = 'home'; keyboardInputEvent.modifierKeysDown.shift = true; break;
				case '[8$': keyboardInputEvent.key = 'end'; keyboardInputEvent.modifierKeysDown.shift = true; break;

				case 'Oa': keyboardInputEvent.key = 'up'; keyboardInputEvent.modifierKeysDown.control = true; break;
				case 'Ob': keyboardInputEvent.key = 'down'; keyboardInputEvent.modifierKeysDown.control = true; break;
				case 'Oc': keyboardInputEvent.key = 'right'; keyboardInputEvent.modifierKeysDown.control = true; break;
				case 'Od': keyboardInputEvent.key = 'left'; keyboardInputEvent.modifierKeysDown.control = true; break;
				case 'Oe': keyboardInputEvent.key = 'clear'; keyboardInputEvent.modifierKeysDown.control = true; break;

				case '[2^': keyboardInputEvent.key = 'insert'; keyboardInputEvent.modifierKeysDown.control = true; break;
				case '[3^': keyboardInputEvent.key = 'delete'; keyboardInputEvent.modifierKeysDown.control = true; break;
				case '[5^': keyboardInputEvent.key = 'pageUp'; keyboardInputEvent.modifierKeysDown.control = true; break;
				case '[6^': keyboardInputEvent.key = 'pageDown'; keyboardInputEvent.modifierKeysDown.control = true; break;
				case '[7^': keyboardInputEvent.key = 'home'; keyboardInputEvent.modifierKeysDown.control = true; break;
				case '[8^': keyboardInputEvent.key = 'end'; keyboardInputEvent.modifierKeysDown.control = true; break;

				case '[Z': keyboardInputEvent.key = 'tab'; keyboardInputEvent.modifierKeysDown.shift = true; break;
				default: keyboardInputEvent.key = 'undefined'; break;
			}
		}
		// Got a longer-than-one string of characters. Probably a paste, since it wasn't a control sequence.
		else if(data.length > 1 && data[0] !== '\x1b') {
			Array.prototype.forEach.call(data, function(subData) {
				// console.log('got multiple keys in a single data event!');
				this.emitKeyboardInputEventFromData(subData);
			}.bind(this));

			return;
		}

		// Update the event identifier
		keyboardInputEvent.identifier += '.'+keyboardInputEvent.key;

		this.emit(keyboardInputEvent.identifier, keyboardInputEvent);
	}

	/*
		Some patterns seen in terminal key escape codes, derived from combos seen
		at http://www.midnight-commander.org/browser/lib/tty/key.c
		ESC letter
		ESC [ letter
		ESC [ modifier letter
		ESC [ 1 ; modifier letter
		ESC [ num char
		ESC [ num ; modifier char
		ESC O letter
		ESC O modifier letter
		ESC O 1 ; modifier letter
		ESC N letter
		ESC [ [ num ; modifier char
		ESC [ [ 1 ; modifier letter
		ESC ESC [ num char
		ESC ESC O letter
		- char is usually ~ but $ and ^ also happen with rxvt
		- modifier is 1 +
					(shift     * 1) +
					(left_alt  * 2) +
					(ctrl      * 4) +
					(right_alt * 8)
		- two leading ESCs apparently mean the same as one leading ESC
	*/
	// Regular expressions used for ANSI escape code splitting
	static metaKeyCodeRegularExpression = /^(?:\x1b)([a-zA-Z0-9])$/;
	static functionKeyCodeRegularExpression = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;

}

// Export
export { StandardInputStream };
