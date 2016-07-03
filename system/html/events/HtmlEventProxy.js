// Dependencies
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');

// Class
var HtmlEventProxy = {};

// Static properties

HtmlEventProxy.domEventIdentifierMap = {
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

	// Document
	'DOMContentLoaded': {
		'htmlDocument.ready': true,
	},

	// Forms
	'change': {
		'form.control.change': true,
	},
	'submit': {
		'form.submit': true,
	},
};

// Static methods

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
		var events = htmlEventEmitter.createEventsFromDomEvent(domEvent, htmlEventEmitter);
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
			//Console.log('Binding domEventIdentifier', domEventIdentifier, 'for eventPattern', eventPattern);

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