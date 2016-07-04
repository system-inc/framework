// Dependencies
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
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
	'DOMContentLoaded': {
		'htmlDocument.ready': true,
	},

	// Mouse
	'click': {
		'mouse.button.[1345].click': true, // Mouse button 2 does not trigger 'click' events
		'interact': true,
	},
	'mouseup': {
		'mouse.button.2.click': true, // Mouse button 2 can only be detected 'mouseup' events
		'mouse.button.*.up': true,
	},
	'mousedown': {
		'mouse.button.*.down': true,
	},

	// Keyboard
	'keydown': {
		'keyboard.key.*.down': true,
	},
	'keyup': {
		'keyboard.key.*.up': true,
		// TODO: 'keyboard.key.(alt|control|meta|shift).press': true,
		'keyboard.key.alt.press': true,
		'keyboard.key.control.press': true,
		'keyboard.key.meta.press': true,
		'keyboard.key.shift.press': true,
	},
	'keypress': {
		'keyboard.key.*.press': true,
	},

	// Composition
	'compositionstart': {
		'composition.start': true,
	},
	'compositionupdate': {
		'composition.update': true,
	},
	'compositionend': {
		'composition.end': true,
	},

	// Selection
	'selectionstart': {
		'selection.start': true,
	},
	'selectionchange': {
		'selection.change': true,
	},
	'select': {
		'selection.end': true,
	},

	// Forms
	'input': {
		'form.control.change': true,
	},
	// I don't think I need this
	//'change': {
	//	'form.control.change': true,
	//},
	'submit': {
		'form.submit': true,
	},

	// Clipboard
	'copy': {
		'clipboard.copy': true,
	},
	'cut': {
		'clipboard.cut': true,
	},
	'paste': {
		'clipboard.paste': true,
	},
	
};

// Static methods

HtmlEventProxy.createEventsFromDomEvent = function(domEvent, emitter, data, eventOptions) {
	//Console.standardWarn('HtmlEventEmitter createEventFromDomEvent arguments', arguments);

	var events = [];

	// Set the proper source emitter
	// For example, if you listen to "form.control.change" events on a form element and you catch the DOM event "change" event passed from
	// an input element, the emitter here would be the form when it actually needs to be the input element
	var sourceEmitter = domEvent.target.htmlNode;
	// Don't even do this check for now, wait and see until the line above breaks
	//if(domEvent.target && domEvent.target.htmlNode) {
	//	sourceEmitter = domEvent.target.htmlNode;
	//}

	// MouseEvent
	if(window && window.MouseEvent && Class.isInstance(domEvent, window.MouseEvent)) {
		events = MouseEvent.createEventsFromDomEvent(domEvent, sourceEmitter, data, eventOptions);
	}
	// KeyboardEvent
	else if(window && (window.KeyboardEvent && Class.isInstance(domEvent, window.KeyboardEvent) || domEvent.keyCode != undefined)) {
		events = KeyboardEvent.createEventsFromDomEvent(domEvent, sourceEmitter, data, eventOptions);
	}
	// FormEvent
	else if(domEvent.type == 'change' || domEvent.type == 'input' || domEvent.type == 'submit') {
		events = FormEvent.createEventsFromDomEvent(domEvent, sourceEmitter, data, eventOptions);
	}
	// ClipboardEvent
	else if(domEvent.type == 'copy' || domEvent.type == 'cut' || domEvent.type == 'paste') {
		events = ClipboardEvent.createEventsFromDomEvent(domEvent, sourceEmitter, data, eventOptions);
	}
	// CompositionEvent
	else if(domEvent.type == 'compositionstart' || domEvent.type == 'compositionupdate' || domEvent.type == 'compositionend') {
		events = CompositionEvent.createEventsFromDomEvent(domEvent, sourceEmitter, data, eventOptions);
	}
	// SelectionEvent
	else if(domEvent.type == 'select' || domEvent.type == 'selectstart' || domEvent.type == 'selectionchange') {
		events = SelectionEvent.createEventsFromDomEvent(domEvent, sourceEmitter, data, eventOptions);
	}
	// All other events
	else {
		events.append(emitter.createEvent(sourceEmitter, domEvent.type, data, eventOptions));
	}

	// Set the common HtmlEvent properties
	events.each(function(eventIndex, event) {
		// Do not allow the custom event to bubble, rather, the domEvent will bubble and custom events will be created as it bubbles
		event.stopPropagation();

		event.domEvent = domEvent;
		event.trusted = domEvent.isTrusted;
	});

	Console.standardWarn('HtmlEventProxy.createEventFromDomEvent events', events);

	return events;
};

// Takes HtmlEvent patterns (e.g., 'mouse.button.one.click') and returns the correlating DOM event identifiers (e.g., 'click')
HtmlEventProxy.htmlEventPatternToDomEventIdentifiers = function(htmlEventPattern) {
	var domEventIdentifiers = [];

	//Console.log('HtmlEventProxy.htmlEventPatternToDomEventIdentifiers', htmlEventPattern);

	HtmlEventProxy.domEventIdentifierMap.each(function(domEventIdentifier, eventIdentifiers) {
		eventIdentifiers.each(function(eventIdentifier) {
			if(RegularExpression.wildcardPatternsMatch(htmlEventPattern, eventIdentifier)) {
				domEventIdentifiers.append(domEventIdentifier);
			}
		});
	});

	// Get rid of duplicates
	domEventIdentifiers = domEventIdentifiers.unique();

	return domEventIdentifiers;
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
	var domEventListenerFunctionToBind = function*(domEvent) {
		// Get the events to emit from the domEvent
		var events = HtmlEventProxy.createEventsFromDomEvent(domEvent, htmlEventEmitter);
		//Console.standardLog('events', events);

		// Emit the event
		yield events.each(function*(eventIndex, event) {
			//Console.standardLog('htmlEventEmitter.emit event', event);
			yield htmlEventEmitter.emit(event.identifier, event);
		});
	}.bind(htmlEventEmitter).toPromise();

	// If we have a valid domEventIdentifier
	if(domEventIdentifiers.length) {
		domEventIdentifiers.each(function(domEventIdentifierIndex, domEventIdentifier) {
			Console.log('Binding domEventIdentifier', domEventIdentifier, 'for eventPattern', eventPattern);

			// If we have a domObject because we are already mounted to the DOM
			if(domObject) {
				// Add the event listener to the domObject
				domObject.addEventListener(domEventIdentifier, domEventListenerFunctionToBind);
			}
			// If we don't have a domObject, wait to be mountedToDom
			else {
				htmlEventEmitter.on(['htmlDocument.mountedToDom', 'htmlNode.mountedToDom'], function() {
					//Console.log('Mounted to DOM, calling domNode.addEventListener now for', htmlEventEmitter.tag, Json.encode(htmlEventEmitter.attributes));

					// Get the domObject from the htmlEventEmitter
					domObject = HtmlEventProxy.getDomObjectFromHtmlEventEmitter(htmlEventEmitter);

					// Add the event listener to the domObject
					domObject.addEventListener(domEventIdentifier, domEventListenerFunctionToBind);
				}.bind(htmlEventEmitter));
			}
		});
	}
	// If we don't have a domEventIdentifier it means the event listener is not for the DOM
	else {
		var common = [
			'htmlDocument.mountedToDom',
			'htmlNode.mountedToDom',
			'htmlNode.domUpdateExecuted',
		];
		if(!common.contains(eventPattern)) {
			Console.log('No domEventIdentifier found for', eventPattern);
		}
	}

	// Add the event listener to the htmlEventEmitter, use HtmlEventEmitter's super class, PropagatingEventEmitter, as opposed to htmlEventEmitter or HtmlEventEmitter, as to not cause an infinite loop
	PropagatingEventEmitter.prototype.addEventListener.apply(htmlEventEmitter, arguments);

	return htmlEventEmitter;
};

// Export
module.exports = HtmlEventProxy;