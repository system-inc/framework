// Dependencies
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
var HtmlDocumentEvent = Framework.require('system/html/events/html-document/HtmlDocumentEvent.js');
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');
var MouseEvent = Framework.require('system/html/events/web-interface/MouseEvent.js');
var KeyboardEvent = Framework.require('system/html/events/web-interface/KeyboardEvent.js');
var FormEvent = Framework.require('system/html/events/web-interface/FormEvent.js');
var ClipboardEvent = Framework.require('system/html/events/web-interface/ClipboardEvent.js');
var CompositionEvent = Framework.require('system/html/events/web-interface/CompositionEvent.js');
var SelectionEvent = Framework.require('system/html/events/web-interface/SelectionEvent.js');

// Class
var HtmlEventProxy = {};

// Static properties

HtmlEventProxy.domEventIdentifierMap = {
	// Document
	DOMContentLoaded: {
		eventClass: HtmlDocumentEvent,
		eventPatterns: {
			'htmlDocument.ready': true,
		},
	},

	// Mouse
	click: {
		eventClass: MouseEvent,
		eventPatterns: {
			'mouse.button.[1345].click.*': true, // Mouse button 2 does not trigger 'click' events
			'interact': true,
		},
	},
	mouseup: {
		eventClass: MouseEvent,
		eventPatterns: {
			'mouse.button.2.click.*': true, // Mouse button 2 can only be detected 'mouseup' events
			'mouse.button.*.up': true,
		},
	},
	mousedown: {
		eventClass: MouseEvent,
		eventPatterns: {
			'mouse.button.*.down': true,
		},
	},

	// Keyboard
	keydown: {
		eventClass: KeyboardEvent,
		eventPatterns: {
			'keyboard.key.*.down': true,
		},
	},
	keyup: {
		eventClass: KeyboardEvent,
		eventPatterns: {
			'keyboard.key.*.up': true,

			// TODO: 'keyboard.key.(alt|control|meta|shift|up|down|left|right).press': true,
			'keyboard.key.alt.press': true,
			'keyboard.key.control.press': true,
			'keyboard.key.meta.press': true,
			'keyboard.key.shift.press': true,

			'keyboard.key.up.press': true,
			'keyboard.key.down.press': true,
			'keyboard.key.left.press': true,
			'keyboard.key.right.press': true,
		},
	},
	keypress: {
		eventClass: KeyboardEvent,
		eventPatterns: {
			'keyboard.key.*.press': true,
		},
	},

	// Composition
	compositionstart: {
		eventClass: CompositionEvent,
		eventPatterns: {
			'composition.start': true,
		},
	},
	compositionupdate: {
		eventClass: CompositionEvent,
		eventPatterns: {
			'composition.update': true,
		},
	},
	compositionend: {
		eventClass: CompositionEvent,
		eventPatterns: {
			'composition.end': true,
		},
	},

	// Selection
	selectionstart: {
		eventClass: SelectionEvent,
		eventPatterns: {
			'selection.start': true,
		},
	},
	selectionchange: {
		eventClass: SelectionEvent,
		eventPatterns: {
			'selection.change': true,
		},
	},
	select: {
		eventClass: SelectionEvent,
		eventPatterns: {
			'selection.end': true,
		},
	},

	// Forms
	input: {
		eventClass: FormEvent,
		eventPatterns: {
			'form.control.change': true,
		},
	},
	// I don't think I need this anymore because I can use the "input" event above
	//change: {
	//	'form.control.change': true,
	//},
	submit: {
		eventClass: FormEvent,
		eventPatterns: {
			'form.submit': true,
		},
	},

	// Clipboard
	copy: {
		eventClass: ClipboardEvent,
		eventPatterns: {
			'clipboard.copy': true,
		},
	},
	cut: {
		eventClass: ClipboardEvent,
		eventPatterns: {
			'clipboard.cut': true,
		},
	},
	paste: {
		eventClass: ClipboardEvent,
		eventPatterns: {
			'clipboard.paste': true,
		},
	},

	// HtmlElement
	focusin: {
		eventClass: HtmlElementEvent,
		eventPatterns: {
			'htmlElement.focus': true,
		},
	},
	focusout: {
		eventClass: HtmlElementEvent,
		eventPatterns: {
			'htmlElement.blur': true,
		},
	},
	scroll: {
		eventClass: HtmlElementEvent,
		eventPatterns: {
			'htmlElement.scroll': true,
		},
	},
	load: {
		eventClass: HtmlElementEvent,
		eventPatterns: {
			'htmlElement.load': true,
		},
	},
	abort: {
		eventClass: HtmlElementEvent,
		eventPatterns: {
			'htmlElement.abort': true,
		},
	},
	error: {
		eventClass: HtmlElementEvent,
		eventPatterns: {
			'htmlElement.error': true,
		},
	},
};

// Static methods

// Takes HtmlEvent patterns (e.g., 'mouse.button.one.click') and returns the correlating DOM event identifiers (e.g., 'click')
HtmlEventProxy.htmlEventPatternToDomEventIdentifiers = function(htmlEventPattern) {
	var domEventIdentifiers = [];

	//Console.log('HtmlEventProxy.htmlEventPatternToDomEventIdentifiers', htmlEventPattern);

	HtmlEventProxy.domEventIdentifierMap.each(function(domEventIdentifier, domEventIdentifierObject) {
		domEventIdentifierObject.eventPatterns.each(function(eventPattern) {
			if(RegularExpression.wildcardPatternsMatch(htmlEventPattern, eventPattern)) {
				domEventIdentifiers.append(domEventIdentifier);	
			}
		});
	});

	// Get rid of duplicates
	domEventIdentifiers = domEventIdentifiers.unique();

	return domEventIdentifiers;
};

HtmlEventProxy.createEventsFromDomEvent = function(domEvent, emitter, eventPattern) {
	//Console.standardWarn('HtmlEventEmitter createEventFromDomEvent arguments', arguments);

	var events = [];

	// Set the proper source emitter
	// For example, if you listen to "form.control.change" events on a form element and you catch the DOM event "change" event passed from
	// an input element, the emitter here would be the form when it actually needs to be the input element
	var sourceEmitter = domEvent.target.htmlNode;

	var classToUseToCreateEventsFromDomEvent = null;

	// Get the class to use to create the events from the DOM event
	if(HtmlEventProxy.domEventIdentifierMap[domEvent.type]) {
		classToUseToCreateEventsFromDomEvent = HtmlEventProxy.domEventIdentifierMap[domEvent.type].eventClass;
	}

	// Use a specific class for certain DOM events
	if(classToUseToCreateEventsFromDomEvent) {
		events = classToUseToCreateEventsFromDomEvent.createEventsFromDomEvent(domEvent, sourceEmitter, eventPattern);
	}
	// If no specific class is specified, use the emitter to create the event
	else {
		events.append(emitter.createEvent(sourceEmitter, domEvent.type));
	}

	// Set the common HtmlEvent properties
	events.each(function(eventIndex, event) {
		// Do not allow the custom event to bubble, rather, the domEvent will bubble and custom events will be created as it bubbles
		event.stopPropagation();

		event.domEvent = domEvent;
		event.trusted = domEvent.isTrusted;
	});

	Console.standardWarn('HtmlEventProxy.createEventFromDomEvent events created', events);

	return events;
};

HtmlEventProxy.getDomObjectFromHtmlEventEmitter = function(htmlEventEmitter) {
	var domObject = null;

	var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
	var HtmlNode = Framework.require('system/html/HtmlNode.js');

	// Set the domObject
	if(HtmlDocument.is(htmlEventEmitter)) {
		domObject = htmlEventEmitter.domDocument;
	}
	else if(HtmlNode.is(htmlEventEmitter)) {
		domObject = htmlEventEmitter.domNode;
	}

	return domObject;
};

HtmlEventProxy.warnAboutCommonEventPatternMistakes = function(eventPattern) {
	var map = {
		// Mouse
		activate: '"interact"',
		click: '"interact" or "mouse.button.one.click"',

		// Keyboard
		keydown: '"keyboard.key.*.down"',
		keyup: '"keyboard.key.*.up"',
		keypress: '"keyboard.key.*.press"',

		// Form
		submit: '"form.submit"',
		change: '"form.field.change"',
	};

	if(map[eventPattern]) {
		throw new Error('Event listener not bound for "'+eventPattern+'". You must use '+map[eventPattern]+' instead of "'+eventPattern+'".');
		//Console.error('Event listener not bound for "'+eventPattern+'". You must use', map[eventPattern], 'instead of "'+eventPattern+'".');
	}
};

HtmlEventProxy.addEventListener = function(eventPattern, functionToBind, timesToRun, htmlEventEmitter) {
	// Allow multiple events to be registered by passing in an array
	if(Array.is(eventPattern)) {
		eventPattern.each(function(currentEventPatternIndex, currentEventPattern) {
			HtmlEventProxy.addEventListener(currentEventPattern, functionToBind, timesToRun, htmlEventEmitter);
		});

		return;
	}
	// Allow multiple events to be registered separated by spaces or ", "
	else if(String.is(eventPattern) && (eventPattern.contains(' ') || eventPattern.contains(','))) {
		eventPattern = eventPattern.replace(', ', ' ');
		eventPattern = eventPattern.replace(',', ' ');
		var eventPatternArray = eventPattern.split(' ');

		eventPatternArray.each(function(currentEventPatternIndex, currentEventPattern) {
			HtmlEventProxy.addEventListener(currentEventPattern, functionToBind, timesToRun, htmlEventEmitter);
		});

		return;
	}

	// Warn about common event pattern mistakes
	HtmlEventProxy.warnAboutCommonEventPatternMistakes(eventPattern);

	// Get the domObject from the htmlEventEmitter
	var domObject = HtmlEventProxy.getDomObjectFromHtmlEventEmitter(htmlEventEmitter);

	// Get the DOM event identifiers for the provided eventPattern
	var domEventIdentifiers = HtmlEventProxy.htmlEventPatternToDomEventIdentifiers(eventPattern);

	// When the DOM object emits a domEvent
	// This function can't be a generator in order to make sure the DOM events are propagated correctly
	// Native DOM events will not wait for the generator function to return
	// As a consequence, this means that any bound generator functions will be emitted immediately
	// TODO: Maybe I can fix this at some point by making the events yield on .emit and somehow
	// controlling when the native DOM event bubbles
	// Note: Event though event.emit is a generator function this seems to be working synchronously
	// such that when I can event.stop() it works
	var domEventListenerFunctionToBind = function(domEvent) {
		// Get the events to emit from the domEvent
		var events = HtmlEventProxy.createEventsFromDomEvent(domEvent, htmlEventEmitter);
		//Console.standardLog('events', events);

		// Emit the event
		events.each(function(eventIndex, event) {
			//Console.standardLog('htmlEventEmitter.emit event', event);
			htmlEventEmitter.emit(event.identifier, event);		
		});
	}.bind(htmlEventEmitter);

	// If we have a valid domEventIdentifier
	if(domEventIdentifiers.length) {
		domEventIdentifiers.each(function(domEventIdentifierIndex, domEventIdentifier) {
			// Don't add duplicate DOM object event listeners, we can just use one
			if(!htmlEventEmitter.eventListenersOnDomObject.contains(domEventIdentifier)) {
				Console.log('Binding domEventIdentifier "'+domEventIdentifier+'" to DOM object, will use for eventPattern "'+eventPattern+'"');

				// Keep track of which DOM object event listeners we have added
				htmlEventEmitter.eventListenersOnDomObject.append(domEventIdentifier);

				// If we have a domObject because we are already mounted to the DOM
				if(domObject) {
					// Add the event listener to the domObject
					domObject.addEventListener(domEventIdentifier, domEventListenerFunctionToBind);
				}
				// If we don't have a domObject, wait to be mountedToDom
				else {
					htmlEventEmitter.on('html*.mountedToDom', function() {
						//Console.log('Mounted to DOM, calling domNode.addEventListener now for', htmlEventEmitter.tag, Json.encode(htmlEventEmitter.attributes));

						// Get the domObject from the htmlEventEmitter
						domObject = HtmlEventProxy.getDomObjectFromHtmlEventEmitter(htmlEventEmitter);

						// Add the event listener to the domObject
						domObject.addEventListener(domEventIdentifier, domEventListenerFunctionToBind);
					}.bind(htmlEventEmitter));
				}
			}
			else {
				Console.log('Already bound domEventIdentifier "'+domEventIdentifier+'" to DOM object, will use the existing one for eventPattern "'+eventPattern+'"');
			}
		});
	}
	// If we don't have a domEventIdentifier it means the event listener is not for the DOM
	else {
		var common = [
			'html*.mountedToDom',
			'htmlDocument.mountedToDom',
			'htmlNode.mountedToDom',
			'htmlNode.domUpdateExecuted',
		];
		if(!common.contains(eventPattern)) {
			Console.log('No domEventIdentifier found for "'+eventPattern+'", the eventPattern must not be for a standard event.');
		}
	}

	// Add the event listener to the htmlEventEmitter, use HtmlEventEmitter's super class, PropagatingEventEmitter, as opposed to htmlEventEmitter or HtmlEventEmitter, as to not cause an infinite loop
	PropagatingEventEmitter.prototype.addEventListener.apply(htmlEventEmitter, arguments);

	return htmlEventEmitter;
};

// Export
module.exports = HtmlEventProxy;