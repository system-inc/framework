// Dependencies
import ElectronTest from 'system/electron/tests/ElectronTest.js';
import Assert from 'system/test/Assert.js';
import HtmlDocument from 'system/interface/graphical/web/html/HtmlDocument.js';
import Html from 'system/interface/graphical/web/html/Html.js';
import InputKeyEvent from 'system/interface/graphical/web/html/events/html-element/input/InputKeyEvent.js';
import WildcardPatternMatcher from 'system/search/patterns/WildcardPatternMatcher.js';
var ElectronManager = null;

// Class
class InputKeyEventTest extends ElectronTest {

	async before() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	}

	async testAllInputKeyEvents() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.head.append(Html.style(`
        	body {
        		font-family: sans-serif;
        		font-size: 12px;
        		padding: 0 0 0 144px;
        		margin: 0;
        	}
        	
        	textarea {
        		display: block;
        		position: fixed;
        		height: 128px;
        		width: 128px;
        		top: 0;
        		left: 0;
        	}
        	.keyContainer {
        		float: left;
    			border: 1px solid #CCC;
    			border-radius: .5em;
    			padding: 1em .5em 1em .5em;
    			margin: 0 .25em .25em 0;
        	}
	        	.key {
	        		font-weight: bold;
	        	}
		        	.keyState {
		        		padding: .25em;
		        		margin: .25em 0;
		        		border: 1px solid #CCC;
		        	}
        	.passed {
        		background: #00AAFF;
        	}
    	`));

		// Create a textarea HtmlElement
		var textAreaElement = Html.textarea();

		textAreaElement.on('input.key.*', function(event) {
			//Console.standardWarn(event.identifier, event);
			var selector = '#'+event.identifier.replace('.', '-');
			//Console.standardInfo('selector', selector);
			var htmlNode = htmlDocument.find(selector);

			if(htmlNode) {
				//Console.standardLog('htmlNode', htmlNode);
				htmlNode.addClass('passed');
			}
			else {
				Console.standardError('could not find htmlNode for ', selector);
			}			
		});
		htmlDocument.body.append(textAreaElement);

		// Loop through all keys and make elements that will highlight when the keys are pressed correctly
        InputKeyEventTest.keys.each(function(key, keyObject) {
			keyObject.locations.each(function(location, locationObject) {
				var currentKey = key;

				if(location != 'standard') {
					currentKey = key+'.'+location;
				}

				var div = Html.div({
					class: 'keyContainer',
				});

				div.append(Html.div({
					content: 'input.key.'+currentKey,
					class: 'key',
				}));

				// input.key.identifier.down
				div.append(Html.div({
					id: ('input.key.'+currentKey+'.down').replace('.', '-'),
					content: 'input.key.'+currentKey+'.down',
					class: 'keyState',
				}));

				// input.key.identifier
				div.append(Html.div({
					id: ('input.key.'+currentKey).replace('.', '-'),
					content: 'input.key.'+currentKey,
					class: 'keyState',
				}));

				// input.key.identifier.up
				div.append(Html.div({
					id: ('input.key.'+currentKey+'.up').replace('.', '-'),
					content: 'input.key.'+currentKey+'.up',
					class: 'keyState',
				}));

				// input.key.identifier.control.down
				div.append(Html.div({
					id: ('input.key.'+currentKey+'.control.down').replace('.', '-'),
					content: 'input.key.'+currentKey+'.control.down',
					class: 'keyState',
				}));

				// input.key.identifier.control
				div.append(Html.div({
					id: ('input.key.'+currentKey+'.control').replace('.', '-'),
					content: 'input.key.'+currentKey+'.control',
					class: 'keyState',
				}));

				// input.key.identifier.control.up
				div.append(Html.div({
					id: ('input.key.'+currentKey+'.control.up').replace('.', '-'),
					content: 'input.key.'+currentKey+'.control.up',
					class: 'keyState',
				}));

				// input.key.identifier.shift.down
				div.append(Html.div({
					id: ('input.key.'+currentKey+'.shift.down').replace('.', '-'),
					content: 'input.key.'+currentKey+'.shift.down',
					class: 'keyState',
				}));

				// input.key.identifier.shift
				div.append(Html.div({
					id: ('input.key.'+currentKey+'.shift').replace('.', '-'),
					content: 'input.key.'+currentKey+'.shift',
					class: 'keyState',
				}));

				// input.key.identifier.shift.up
				div.append(Html.div({
					id: ('input.key.'+currentKey+'.shift.up').replace('.', '-'),
					content: 'input.key.'+currentKey+'.shift.up',
					class: 'keyState',
				}));

				htmlDocument.body.append(div);
			});
        });

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        throw new Error('Throwing error to display browser window.');
	}

	async testInputKeyEvent() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle('margin', 0);
        htmlDocument.body.setStyle('padding', '30px');

		// Create a textarea HtmlElement
		var htmlElement = Html.textarea();

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		// Set a variable to capture the event
		var capturedEvent = null;

		// Add an event listener to the textarea to capture the event when triggered

		//htmlElement.on('input.key.*', function(event) {
		htmlElement.on('input.key.a', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click into the text area
		await ElectronManager.clickHtmlElement(htmlElement);

		// Type a key
		await ElectronManager.pressKey('a');
		Assert.true(Class.isInstance(capturedEvent, InputKeyEvent), '"input.key.a" events triggered by key presses are instances of InputKeyEvent');

		Assert.strictEqual(capturedEvent.modifierKeysDown.alt, false, 'modifierKeysDown.alt property is correctly set');
		Assert.strictEqual(capturedEvent.modifierKeysDown.control, false, 'modifierKeysDown.control property is correctly set');
		Assert.strictEqual(capturedEvent.modifierKeysDown.meta, false, 'modifierKeysDown.command property is correctly set');
		Assert.strictEqual(capturedEvent.modifierKeysDown.shift, false, 'modifierKeysDown.shift property is correctly set');

		Assert.strictEqual(capturedEvent.key, 'a', 'key property is correctly set');

		Assert.strictEqual(capturedEvent.keyLocation, 'standard', 'keyLocation property is correctly set');

		Assert.strictEqual(capturedEvent.keyHeldDown, false, 'keyHeldDown property is correctly set');

		Assert.strictEqual(capturedEvent.trusted, true, 'trusted property is correctly set');

		//throw new Error('Throwing error to display browser window.');
	}

	async testVariousInputKeyEvents() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle('margin', 0);
        htmlDocument.body.setStyle('padding', '30px');

		// Create a textarea HtmlElement
		var htmlElement = Html.textarea();

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		// Set a variable to capture the event
		var capturedEventKeyboardKeyUp = null;
		var capturedEventKeyboardKeyUpCount = 0;
		var capturedEventKeyboardKeyDown = null;
		var capturedEventKeyboardKeyDownCount = 0;
		var capturedEventKeyboardKeyLeft = null;
		var capturedEventKeyboardKeyLeftCount = 0;
		var capturedEventKeyboardKeyRight = null;
		var capturedEventKeyboardKeyRightCount = 0;
		var capturedEventKeyboardKeyEnter = null;
		var capturedEventKeyboardKeyEnterCount = 0;
		var capturedEventKeyboardKeyBackspace = null;
		var capturedEventKeyboardKeyBackspaceCount = 0;
		var capturedEventKeyboardKeySpace = null;
		var capturedEventKeyboardKeySpaceCount = 0;
		var capturedEventKeyboardKeyAlt = null;
		var capturedEventKeyboardKeyAltCount = 0;
		var capturedEventKeyboardKeyControl = null;
		var capturedEventKeyboardKeyControlCount = 0;
		var capturedEventKeyboardKeyMeta = null;
		var capturedEventKeyboardKeyMetaCount = 0;
		var capturedEventKeyboardKeyShift = null;
		var capturedEventKeyboardKeyShiftCount = 0;
		var capturedEventKeyboardKeyDelete = null;
		var capturedEventKeyboardKeyDeleteCount = 0;
		var capturedEventKeyboardKeyInsert = null;
		var capturedEventKeyboardKeyInsertCount = 0;

		//htmlElement.on('input.*', function(event) {
		//htmlElement.on('input.key.*', function(event) {
		htmlElement.on('input.key.up', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyUp = event;
			capturedEventKeyboardKeyUpCount++;
		});
		htmlElement.on('input.key.down', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyDown = event;
			capturedEventKeyboardKeyDownCount++;
		});
		htmlElement.on('input.key.left', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyLeft = event;
			capturedEventKeyboardKeyLeftCount++;
		});
		htmlElement.on('input.key.right', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyRight = event;
			capturedEventKeyboardKeyRightCount++;
		});
		htmlElement.on('input.key.enter', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyEnter = event;
			capturedEventKeyboardKeyEnterCount++;
		});
		htmlElement.on('input.key.backspace', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyBackspace = event;
			capturedEventKeyboardKeyBackspaceCount++;
		});
		htmlElement.on('input.key.space', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeySpace = event;
			capturedEventKeyboardKeySpaceCount++;
		});
		htmlElement.on('input.key.alt', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyAlt = event;
			capturedEventKeyboardKeyAltCount++;
		});
		htmlElement.on('input.key.control', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyControl = event;
			capturedEventKeyboardKeyControlCount++;
		});
		htmlElement.on('input.key.(command|windows)', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyMeta = event;
			capturedEventKeyboardKeyMetaCount++;
		});
		htmlElement.on('input.key.shift', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyShift = event;
			capturedEventKeyboardKeyShiftCount++;
		});
		htmlElement.on('input.key.delete', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyDelete = event;
			capturedEventKeyboardKeyDeleteCount++;
		});
		htmlElement.on('input.key.insert', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyInsert = event;
			capturedEventKeyboardKeyInsertCount++;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click into the text area
		await ElectronManager.clickHtmlElement(htmlElement);

		await ElectronManager.keyDown('Up');
		await ElectronManager.keyUp('Up');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyUp, InputKeyEvent), '"input.key.up" events are instances of InputKeyEvent');

		await ElectronManager.keyPress('Down');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyDown, InputKeyEvent), '"input.key.down" events are instances of InputKeyEvent');

		await ElectronManager.keyPress('Left');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyLeft, InputKeyEvent), '"input.key.left" events are instances of InputKeyEvent');

		await ElectronManager.keyPress('Right');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyRight, InputKeyEvent), '"input.key.right" events are instances of InputKeyEvent');

		await ElectronManager.keyPress('Enter');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyEnter, InputKeyEvent), '"input.key.enter" events are instances of InputKeyEvent');

		await ElectronManager.keyDown('Backspace');
		await ElectronManager.keyUp('Backspace');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyBackspace, InputKeyEvent), '"input.key.backspace" events are instances of InputKeyEvent');

		await ElectronManager.keyPress('Space');
		Assert.true(Class.isInstance(capturedEventKeyboardKeySpace, InputKeyEvent), '"input.key.space" events are instances of InputKeyEvent');

		await ElectronManager.keyPress('Alt');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyAlt, InputKeyEvent), '"input.key.alt" events are instances of InputKeyEvent');

		await ElectronManager.keyPress('Control');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyControl, InputKeyEvent), '"input.key.control" events are instances of InputKeyEvent');

		await ElectronManager.keyPress('Meta');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyMeta, InputKeyEvent), '"input.key.meta" events are instances of InputKeyEvent');

		await ElectronManager.keyPress('Shift');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyShift, InputKeyEvent), '"input.key.shift" events are instances of InputKeyEvent');

		await ElectronManager.keyPress('Delete');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyDelete, InputKeyEvent), '"input.key.delete" events are instances of InputKeyEvent');

		await ElectronManager.keyPress('Insert');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyInsert, InputKeyEvent), '"input.key.insert" events are instances of InputKeyEvent');

		// Check counts
		Assert.strictEqual(capturedEventKeyboardKeyUpCount, 1, '"input.key.up" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyDownCount, 1, '"input.key.down" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyLeftCount, 1, '"input.key.left" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyRightCount, 1, '"input.key.right" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyEnterCount, 1, '"input.key.enter" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyBackspaceCount, 1, '"input.key.backspace" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeySpaceCount, 1, '"input.key.space" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyAltCount, 1, '"input.key.alt" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyControlCount, 1, '"input.key.control" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyMetaCount, 1, '"input.key.meta" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyShiftCount, 1, '"input.key.shift" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyDeleteCount, 1, '"input.key.delete" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyInsertCount, 1, '"input.key.insert" events are emitted the correct number of times');

		//throw new Error('Throwing error to display browser window.');
	}

	static keys = {
		'escape': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f1': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f2': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f3': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f4': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f5': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f6': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f7': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f8': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f9': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f10': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f11': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'f12': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'graveAccent': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'tilde': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'1': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'exclamation': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'2': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'at': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'3': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'number': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'4': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'dollar': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'5': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'percent': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'6': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'caret': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'7': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'ampersand': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'8': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'asterisk': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: true,
				},
			},
		},
		'9': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'leftParenthesis': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'0': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'rightParenthesis': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'minus': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'underscore': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'equals': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'plus': {
			locations: {
				'standard': {
					requiresShift: true,
				},
				'numericKeypad': {
					requiresShift: false,
				},
			},
		},
		'backspace': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'tab': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'q': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'Q': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'w': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'W': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'e': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'E': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'r': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'R': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		't': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'T': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'y': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'Y': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'u': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'U': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'i': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'I': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'o': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'O': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'p': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'P': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'leftBracket': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'leftBrace': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'rightBracket': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'rightBrace': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'backslash': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'verticalBar': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'capsLock': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'a': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'A': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		's': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'S': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'd': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'D': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'f': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'F': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'g': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'G': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'h': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'H': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'j': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'J': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'k': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'K': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'l': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'L': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'semicolon': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'colon': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'singleQuote': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'doubleQuote': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'enter': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'shift': {
			locations: {
				'standard': {
					requiresShift: false,
				},
				'left': {
					requiresShift: false,
				},
				'right': {
					requiresShift: false,
				},
			},
		},
		'z': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'Z': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'x': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'X': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'c': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'C': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'v': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'V': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'b': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'B': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'n': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'N': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'm': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'M': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'comma': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'lessThan': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'period': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},	
		'moreThan': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},	
		'forwardSlash': {
			locations: {
				'numericKeypad': {
					requiresShift: false,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'question': {
			locations: {
				'standard': {
					requiresShift: true,
				},
			},
		},
		'control': {
			locations: {
				'standard': {
					requiresShift: false,
				},
				'left': {
					requiresShift: false,
				},
				'right': {
					requiresShift: false,
				},
			},
		},
		'windows': {
			locations: {
				'standard': {
					requiresShift: false,
				},
				'left': {
					requiresShift: false,
				},
				'right': {
					requiresShift: false,
				},
			},
		},
		'alt': {
			locations: {
				'standard': {
					requiresShift: false,
				},
				'left': {
					requiresShift: false,
				},
				'right': {
					requiresShift: false,
				},
			},
		},
		'space': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'contextMenu': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'option': {
			locations: {
				'standard': {
					requiresShift: false,
				},
				'left': {
					requiresShift: false,
				},
				'right': {
					requiresShift: false,
				},
			},
		},
		'command': {
			locations: {
				'standard': {
					requiresShift: false,
				},
				'left': {
					requiresShift: false,
				},
				'right': {
					requiresShift: false,
				},
			},
		},
		'printScreen': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'scrollLock': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'pause': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
		'insert': {
			locations: {
				'numericKeypad': {
					requiresShift: true,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'home': {
			locations: {
				'numericKeypad': {
					requiresShift: true,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'pageUp': {
			locations: {
				'numericKeypad': {
					requiresShift: true,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'delete': {
			locations: {
				'standard': {
					requiresShift: false,
				},
				'numericKeypad': {
					requiresShift: true,
				},
			},
		},
		'end': {
			locations: {
				'numericKeypad': {
					requiresShift: true,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'pageDown': {
			locations: {
				'numericKeypad': {
					requiresShift: true,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'up': {
			locations: {
				'numericKeypad': {
					requiresShift: true,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'left': {
			locations: {
				'numericKeypad': {
					requiresShift: true,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'down': {
			locations: {
				'numericKeypad': {
					requiresShift: true,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'right': {
			locations: {
				'numericKeypad': {
					requiresShift: true,
				},
				'standard': {
					requiresShift: false,
				},
			},
		},
		'numLock': {
			locations: {
				'standard': {
					requiresShift: false,
				},
			},
		},
	};

}

// Export
export default InputKeyEventTest;
