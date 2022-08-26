// Dependencies
import { StandardStream } from '@framework/system/stream/StandardStream.js';
import { StandardInputEventManager } from '@framework/system/stream/events/StandardInputEventManager.js';
import { StandardInputKeyEvent } from '@framework/system/stream/events/StandardInputKeyEvent.js';
import { StandardInputPressEvent } from '@framework/system/stream/events/StandardInputPressEvent.js';
import { StandardInputHoverEvent } from '@framework/system/stream/events/StandardInputHoverEvent.js';
import { StandardInputScrollEvent } from '@framework/system/stream/events/StandardInputScrollEvent.js';

// Class
class StandardInputStream extends StandardStream {

	nodeStream = Node.Process.stdin;
	nodeStreamStandardWrite = Node.Process.stdin.write;
	eventManager = new StandardInputEventManager(this);
	mouseInputEventsEnabled = false;

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
				// Make sure we are working with a mouse specific code
				if(
					mouseInputEventCode !== '' && // Make sure the code is not an empty string
					(mouseInputEventCode.endsWith('M') || mouseInputEventCode.endsWith('m')) // And the code ends with an M or m
				) {
					let mouseInputEventCodeParts = this.handleMouseInputEventCode(mouseInputEventCode);
					let event = this.createMouseInputEventFromCodeParts(mouseInputEventCodeParts);
					this.emit(event.identifier, event);

					// Terminal.moveCursorTo(1, 1);
					// Terminal.clearLine();
					// Terminal.writeLine(Json.encode(event));
				}
			}.bind(this));
		}
		// Handle key input events
		else {
			// let keyInputEvent = this.handleKeyInputEvent(data);
			// this.emit(keyInputEvent.identifier, keyInputEvent);

			// Emit a data event
			this.emit('data', data);
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

		return mouseInputEventCodeParts;
	}

	createMouseInputEventFromCodeParts(mouseInputEventCodeParts) {
		// Determine which event we are going to fire
		let event = null;

		// Scrolling
		if(mouseInputEventCodeParts.scroll) {
			// Use a scroll event
			event = new StandardInputScrollEvent();
		}
		// Moving
		else if(mouseInputEventCodeParts.move) {
			event = new StandardInputHoverEvent();
		}
		// Pressing
		else {
			// Use a press event
			event = new StandardInputPressEvent();
		}

		// Modifier keys down
		event.modifierKeysDown.alt = mouseInputEventCodeParts.altDown, // true if the alt key was down when the mouse event was emitted
		event.modifierKeysDown.control = mouseInputEventCodeParts.controlDown, // true if the control key was down when the mouse event was emitted
		event.modifierKeysDown.shift = mouseInputEventCodeParts.shiftDown, // true if the shift key was down when the mouse event was emitted

		// Position
		event.position.x = mouseInputEventCodeParts.x;
		event.position.y = mouseInputEventCodeParts.y;

		// Parse which button is involved in the event
		if(mouseInputEventCodeParts.button == 0x0) {
			event.button = 1;
		}
		else if(mouseInputEventCodeParts.button == 0x2) {
			event.button = 2;
		}

		// Scroll events
		if(mouseInputEventCodeParts.scroll) {
			if(mouseInputEventCodeParts.button == 0x0) {
				event.direction = 'up';
				event.identifier = 'input.scroll.up';
			}
			else {
				event.direction = 'down';
				event.identifier = 'input.scroll.down';
			}

			// Clear event.button
			event.button = null;
		}
		// Move
		else if(mouseInputEventCodeParts.move) {
			event.identifier = 'input.hover';

			// TO DO: Implement drag
			// if(event.button) {
			// 	event.identifier = 'mouseDrag';
			// }
		}
		// Press
		else {
			// Primary button
			if(event.button == 1) {
				if(mouseInputEventCodeParts.boolean) {
					event.identifier = 'input.press.down';
				}
				else {
					event.identifier = 'input.press.up';
				}
			}
			// Secondary button
			else if(event.button == 2) {
				if(mouseInputEventCodeParts.boolean) {
					event.identifier = 'input.press.secondary.down';
				}
				else {
					event.identifier = 'input.press.secondary.up';
				}
			}
			// Tertiary button
			else if(event.button == 3) {
				if(mouseInputEventCodeParts.boolean) {
					event.identifier = 'input.press.tertiary.down';
				}
				else {
					event.identifier = 'input.press.tertiary.up';
				}
			}
		}
		
		return event;
	}

	handleKeyInputEvent(data) {
		let inputEvent = {
			key: null,
			code: null,
			modifierKeysDown: {
				alt: null, // true if the alt key was down
				control: null, // true if the control key was down
				meta: null, // true if the windows key or command key was down 
				shift: null, // true if the shift key was down
			},
			sequence: data,
		};
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
    		inputEvent.key = 'return';
  		}
		// Enter, should have been called linefeed
  		else if(data === '\n') {
    		inputEvent.key = 'enter';
  		}
		// Tab
  		else if(data === '\t') {
    		inputEvent.key = 'tab';
  		}
		// Backspace or ctrl+h
  		else if(data === '\b' || data === '\x7f' || data === '\x1b\x7f' || data === '\x1b\b') {
    		inputEvent.key = 'backspace';
    		inputEvent.modifierKeysDown.meta = (data.charAt(0) === '\x1b');
  		}
		// Escape
		else if(data === '\x1b' || data === '\x1b\x1b') {
    		inputEvent.key = 'escape';
    		inputEvent.modifierKeysDown.meta = (data.length === 2);
		}
		// Space
		else if(data === ' ' || data === '\x1b ') {
			inputEvent.key = 'space';
			inputEvent.modifierKeysDown.meta = (data.length === 2);
		}
		// Ctrl + character
		else if(data <= '\x1a') {
			inputEvent.key = String.fromCharCode(data.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
			inputEvent.modifierKeysDown.control = true;
		}
		// Lowercase character
		else if(data.length === 1 && data >= 'a' && data <= 'z') {
			inputEvent.key = data;
		}
		// Shift + character
		else if(data.length === 1 && data >= 'A' && data <= 'Z') {
			inputEvent.key = data.toLowerCase();
			inputEvent.modifierKeysDown.shift = true;
		}
		// Meta + character 
		else if(parts = StandardInputStream.metaKeyCodeRegularExpression.exec(data)) {
			inputEvent.key = parts[1].toLowerCase();
			inputEvent.modifierKeysDown.meta = true;
			inputEvent.modifierKeysDown.shift = /^[A-Z]$/.test(parts[1]);
		}
		// ANSI escape sequence
		else if(parts = StandardInputStream.functionKeyCodeRegularExpression.exec(data)) {
			// Reassemble the key code leaving out leading \x1b's, the modifier key bitflag and any meaningless '1;' sequence
			let code = (parts[1] || '') + (parts[2] || '') + (parts[4] || '') + (parts[6] || '');
			let modifier = (parts[3] || parts[5] || 1) - 1;

			// Parse the key modifier
			inputEvent.modifierKeysDown.control = !!(modifier & 4);
			inputEvent.modifierKeysDown.meta = !!(modifier & 10);
			inputEvent.modifierKeysDown.shift = !!(modifier & 1);
			inputEvent.code = code;

			// Parse the key itself
			switch(code) {
				/* xterm/gnome ESC O letter */
				case 'OP': inputEvent.key = 'f1'; break;
				case 'OQ': inputEvent.key = 'f2'; break;
				case 'OR': inputEvent.key = 'f3'; break;
				case 'OS': inputEvent.key = 'f4'; break;

				/* xterm/rxvt ESC [ number ~ */
				case '[11~': inputEvent.key = 'f1'; break;
				case '[12~': inputEvent.key = 'f2'; break;
				case '[13~': inputEvent.key = 'f3'; break;
				case '[14~': inputEvent.key = 'f4'; break;

				/* from Cygwin and used in libuv */
				case '[[A': inputEvent.key = 'f1'; break;
				case '[[B': inputEvent.key = 'f2'; break;
				case '[[C': inputEvent.key = 'f3'; break;
				case '[[D': inputEvent.key = 'f4'; break;
				case '[[E': inputEvent.key = 'f5'; break;

				/* common */
				case '[15~': inputEvent.key = 'f5'; break;
				case '[17~': inputEvent.key = 'f6'; break;
				case '[18~': inputEvent.key = 'f7'; break;
				case '[19~': inputEvent.key = 'f8'; break;
				case '[20~': inputEvent.key = 'f9'; break;
				case '[21~': inputEvent.key = 'f10'; break;
				case '[23~': inputEvent.key = 'f11'; break;
				case '[24~': inputEvent.key = 'f12'; break;

				/* xterm ESC [ letter */
				case '[A': inputEvent.key = 'up'; break;
				case '[B': inputEvent.key = 'down'; break;
				case '[C': inputEvent.key = 'right'; break;
				case '[D': inputEvent.key = 'left'; break;
				case '[E': inputEvent.key = 'clear'; break;
				case '[F': inputEvent.key = 'end'; break;
				case '[H': inputEvent.key = 'home'; break;

				/* xterm/gnome ESC O letter */
				case 'OA': inputEvent.key = 'up'; break;
				case 'OB': inputEvent.key = 'down'; break;
				case 'OC': inputEvent.key = 'right'; break;
				case 'OD': inputEvent.key = 'left'; break;
				case 'OE': inputEvent.key = 'clear'; break;
				case 'OF': inputEvent.key = 'end'; break;
				case 'OH': inputEvent.key = 'home'; break;

				/* xterm/rxvt ESC [ number ~ */
				case '[1~': inputEvent.key = 'home'; break;
				case '[2~': inputEvent.key = 'insert'; break;
				case '[3~': inputEvent.key = 'delete'; break;
				case '[4~': inputEvent.key = 'end'; break;
				case '[5~': inputEvent.key = 'pageUp'; break;
				case '[6~': inputEvent.key = 'pageDown'; break;

				/* putty */
				case '[[5~': inputEvent.key = 'pageUp'; break;
				case '[[6~': inputEvent.key = 'pageDown'; break;

				/* rxvt */
				case '[7~': inputEvent.key = 'home'; break;
				case '[8~': inputEvent.key = 'end'; break;

				/* rxvt keys with modifiers */
				case '[a': inputEvent.key = 'up'; inputEvent.modifierKeysDown.shift = true; break;
				case '[b': inputEvent.key = 'down'; inputEvent.modifierKeysDown.shift = true; break;
				case '[c': inputEvent.key = 'right'; inputEvent.modifierKeysDown.shift = true; break;
				case '[d': inputEvent.key = 'left'; inputEvent.modifierKeysDown.shift = true; break;
				case '[e': inputEvent.key = 'clear'; inputEvent.modifierKeysDown.shift = true; break;

				case '[2$': inputEvent.key = 'insert'; inputEvent.modifierKeysDown.shift = true; break;
				case '[3$': inputEvent.key = 'delete'; inputEvent.modifierKeysDown.shift = true; break;
				case '[5$': inputEvent.key = 'pageUp'; inputEvent.modifierKeysDown.shift = true; break;
				case '[6$': inputEvent.key = 'pageDown'; inputEvent.modifierKeysDown.shift = true; break;
				case '[7$': inputEvent.key = 'home'; inputEvent.modifierKeysDown.shift = true; break;
				case '[8$': inputEvent.key = 'end'; inputEvent.modifierKeysDown.shift = true; break;

				case 'Oa': inputEvent.key = 'up'; inputEvent.modifierKeysDown.control = true; break;
				case 'Ob': inputEvent.key = 'down'; inputEvent.modifierKeysDown.control = true; break;
				case 'Oc': inputEvent.key = 'right'; inputEvent.modifierKeysDown.control = true; break;
				case 'Od': inputEvent.key = 'left'; inputEvent.modifierKeysDown.control = true; break;
				case 'Oe': inputEvent.key = 'clear'; inputEvent.modifierKeysDown.control = true; break;

				case '[2^': inputEvent.key = 'insert'; inputEvent.modifierKeysDown.control = true; break;
				case '[3^': inputEvent.key = 'delete'; inputEvent.modifierKeysDown.control = true; break;
				case '[5^': inputEvent.key = 'pageUp'; inputEvent.modifierKeysDown.control = true; break;
				case '[6^': inputEvent.key = 'pageDown'; inputEvent.modifierKeysDown.control = true; break;
				case '[7^': inputEvent.key = 'home'; inputEvent.modifierKeysDown.control = true; break;
				case '[8^': inputEvent.key = 'end'; inputEvent.modifierKeysDown.control = true; break;

				/* misc. */
				case '[Z': inputEvent.key = 'tab'; inputEvent.modifierKeysDown.shift = true; break;
				default: inputEvent.key = 'undefined'; break;
			}
		}
		// Got a longer-than-one string of characters. Probably a paste, since it wasn't a control sequence.
		else if(data.length > 1 && data[0] !== '\x1b') {
			Array.prototype.forEach.call(data, function(subData) {
				this.handleKeyInputEvent(subData);
			}.bind(this));

			return;
		}		
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
