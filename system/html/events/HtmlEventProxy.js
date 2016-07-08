// Dependencies
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
var HtmlDocumentEvent = Framework.require('system/html/events/html-document/HtmlDocumentEvent.js');
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');
var ClipboardEvent = Framework.require('system/html/events/html-event/ClipboardEvent.js');
var InputComposeEvent = Framework.require('system/html/events/html-element/input/InputComposeEvent.js');
var InputHoverEvent = Framework.require('system/html/events/html-element/input/InputHoverEvent.js');
var InputKeyEvent = Framework.require('system/html/events/html-element/input/InputKeyEvent.js');
var InputPressEvent = Framework.require('system/html/events/html-element/input/InputPressEvent.js');
var InputScrollEvent = Framework.require('system/html/events/html-element/input/InputScrollEvent.js');
var InputSelectEvent = Framework.require('system/html/events/html-element/input/InputSelectEvent.js');
var FormEvent = Framework.require('system/html/events/html-element/FormEvent.js');

// Class
var HtmlEventProxy = {};

// Static properties

HtmlEventProxy.domEventIdentifierMap = {
	// htmlDocument.*
	DOMContentLoaded: {
		eventClass: HtmlDocumentEvent,
		eventPatterns: {
			'htmlDocument.ready': true,
		},
	},
	resize: {
		eventClass: HtmlDocumentEvent,
		eventPatterns: {
			'htmlDocument.resize': true,
		},
	},

	// htmlDocument.* and htmlElement.*
	scroll: {
		eventClass: HtmlElementEvent,
		eventPatterns: {
			'htmlDocument.scroll.*': true,
			'htmlElement.scroll.*': true,
		},
	},

	// htmlElement.*
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

	// clipboard.*
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

	// input.compose.*
	compositionstart: {
		eventClass: InputComposeEvent,
		eventPatterns: {
			'input.compose.start': true,
		},
	},
	compositionupdate: {
		eventClass: InputComposeEvent,
		eventPatterns: {
			'input.compose.update': true,
		},
	},
	compositionend: {
		eventClass: InputComposeEvent,
		eventPatterns: {
			'input.compose': true,
		},
	},

	// input.hover.*
	mousemove: {
		eventClass: InputHoverEvent,
		eventPatterns: {
			'input.hover': true,
		},
	},
	mouseenter: {
		eventClass: InputHoverEvent,
		eventPatterns: {
			'input.hover.in': true,
		},
	},
	mouseleave: {
		eventClass: InputHoverEvent,
		eventPatterns: {
			'input.hover.out': true,
		},
	},
	mouseover: {
		eventClass: InputHoverEvent,
		eventPatterns: {
			'input.hover.in.exact': true,
		},
	},
	mouseout: {
		eventClass: InputHoverEvent,
		eventPatterns: {
			'input.hover.out.exact': true,
		},
	},

	// input.key.*
	keydown: {
		eventClass: InputKeyEvent,
		eventPatterns: {
			'input.key.*.down': true,
		},
	},
	keyup: {
		eventClass: InputKeyEvent,
		eventPatterns: {
			'input.key.*.up': true,

			// TODO: 'input.key.(alt|control|etc...)': true,

			'input.key.alt': true,
			'input.key.control': true,
			'input.key.meta': true,
			'input.key.shift': true,
			'input.key.up': true,
			'input.key.down': true,
			'input.key.left': true,
			'input.key.right': true,
			'input.key.backspace': true,
			'input.key.delete': true,
			'input.key.insert': true,
			'input.key.contextMenu': true,
			'input.key.escape': true,
		},
	},
	keypress: {
		eventClass: InputKeyEvent,
		eventPatterns: {
			'input.key.*': true,
		},
	},

	// input.press.*
	click: {
		eventClass: InputPressEvent,
		eventPatterns: {
			'input.press.*': true,
		},
	},
	mouseup: {
		eventClass: InputPressEvent,
		eventPatterns: {
			'input.press.*.up': true,
			'input.press.secondary.*': true, // Mouse button 2 can only be detected 'mouseup' events
		},
	},
	mousedown: {
		eventClass: InputPressEvent,
		eventPatterns: {
			'input.press.*.down': true,
		},
	},

	// input.scroll.*
	wheel: {
		eventClass: InputScrollEvent,
		eventPatterns: {
			'input.scroll.*': true,
		},
	},

	// input.select.*
	selectionstart: {
		eventClass: InputSelectEvent,
		eventPatterns: {
			'input.select.start': true,
		},
	},
	selectionchange: {
		eventClass: InputSelectEvent,
		eventPatterns: {
			'input.select.change': true,
		},
	},
	select: {
		eventClass: InputSelectEvent,
		eventPatterns: {
			'input.select': true,
		},
	},

	// form.*
	input: {
		eventClass: FormEvent,
		eventPatterns: {
			'form.control.change': true,
		},
	},
	submit: {
		eventClass: FormEvent,
		eventPatterns: {
			'form.submit': true,
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

HtmlEventProxy.createEventsFromDomEvent = function(domEvent, emitter) {
	//Console.standardWarn('HtmlEventEmitter createEventFromDomEvent arguments', arguments);

	var events = [];

	
	var sourceEmitter = null;

	// Set the proper source emitter
	// For example, if you listen to "form.control.change" events on a form element and you catch the DOM event "change" event passed from
	// an input element, the emitter here would be the form when it actually needs to be the input element
	if(domEvent.target && domEvent.target.htmlNode) {
		sourceEmitter = domEvent.target.htmlNode
	}
	else {
		sourceEmitter = emitter;
	}

	var classToUseToCreateEventsFromDomEvent = null;

	// Get the class to use to create the events from the DOM event
	if(HtmlEventProxy.domEventIdentifierMap[domEvent.type]) {
		classToUseToCreateEventsFromDomEvent = HtmlEventProxy.domEventIdentifierMap[domEvent.type].eventClass;
	}

	// Use a specific class for certain DOM events
	if(classToUseToCreateEventsFromDomEvent) {
		events = classToUseToCreateEventsFromDomEvent.createEventsFromDomEvent(domEvent, sourceEmitter);
	}
	// If no specific class is specified, use the emitter to create the event
	else {
		Console.standardError('No class specified', sourceEmitter, domEvent);
		events.append(emitter.createEvent(sourceEmitter, domEvent.type));
	}

	// Set the common HtmlEvent properties
	events.each(function(eventIndex, event) {
		// Do not allow the custom event to bubble, rather, the domEvent will bubble and custom events will be created as it bubbles
		event.stopPropagation();

		event.domEvent = domEvent;
		event.trusted = domEvent.isTrusted;
	});

	//Console.standardWarn('HtmlEventProxy.createEventFromDomEvent events created', events);

	return events;
};

HtmlEventProxy.getDomObjectFromHtmlEventEmitter = function(htmlEventEmitter, domEventIdentifier) {
	var domObject = null;

	var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
	var HtmlNode = Framework.require('system/html/HtmlNode.js');

	// Set the domObject
	if(HtmlDocument.is(htmlEventEmitter)) {
		if(domEventIdentifier == 'resize') {
			domObject = htmlEventEmitter.domDocument.defaultView; // window
		}
		else {
			domObject = htmlEventEmitter.domDocument;
		}
	}
	else if(HtmlNode.is(htmlEventEmitter)) {
		domObject = htmlEventEmitter.domNode;
	}

	return domObject;
};

HtmlEventProxy.warnAboutCommonEventPatternMistakes = function(eventPattern) {
	var map = {
		activate: '"input.press"',
		interact: '"input.press"',
		click: '"input.press"',
		keydown: '"input.key.*.down"',
		keyup: '"input.key.*.up"',
		keypress: '"input.key.*.press"',
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

	if(!htmlEventEmitter) {
		Console.standardError('No event emitter', eventPattern);
	}

	// Warn about common event pattern mistakes
	HtmlEventProxy.warnAboutCommonEventPatternMistakes(eventPattern);

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
				// Get the domObject from the htmlEventEmitter
				var domObject = HtmlEventProxy.getDomObjectFromHtmlEventEmitter(htmlEventEmitter, domEventIdentifier);

				Console.standardLog('Binding domEventIdentifier "'+domEventIdentifier+'" to DOM object', domObject, ' will use for eventPattern "'+eventPattern+'"');

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