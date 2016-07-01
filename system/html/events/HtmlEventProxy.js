// Dependencies
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');

// Class
var HtmlEventProxy = {};

// Static properties

// Static methods

// Takes HtmlEvent patterns (e.g., 'mouse.button.one.click') and returns the correlating DOM event identifier (e.g., 'click')
HtmlEventProxy.htmlEventPatternToDomEventIdentifier = function(htmlEventPattern) {
	var domEventIdentifier = null;

	if(htmlEventPattern == 'htmlDocument.ready') {
		domEventIdentifier = 'DOMContentLoaded';
	}
	else if(RegularExpression.stringMatchesWildcardPattern(htmlEventPattern, 'mouse.*.click.*') || htmlEventPattern == 'interact') {
		domEventIdentifier = 'click';
	}
	else if(htmlEventPattern == 'form.control.change') {
		domEventIdentifier = 'change';
	}
	else if(htmlEventPattern == 'form.submit') {
		domEventIdentifier = 'submit';
	}
	else if(RegularExpression.stringMatchesWildcardPattern(htmlEventPattern, 'keyboard.key.*.up.*')) {
		domEventIdentifier = 'keyup';
	}
	else if(RegularExpression.stringMatchesWildcardPattern(htmlEventPattern, 'keyboard.key.*.down.*')) {
		domEventIdentifier = 'keydown';
	}
	else if(RegularExpression.stringMatchesWildcardPattern(htmlEventPattern, 'keyboard.key.*.press.*')) {
		domEventIdentifier = 'keypress';
	}

	return domEventIdentifier;
};

HtmlEventProxy.domEventIdentifierToHtmlEventIdentifier = function(domEventIdentifier) {
	var htmlEventIdentifier = null;

	if(domEventIdentifier == 'DOMContentLoaded') {
		htmlEventIdentifier = 'htmlDocument.ready';
	}
	else if(domEventIdentifier == 'click') {
		htmlEventIdentifier = 'interact';
	}
	else if(domEventIdentifier == 'change') {
		htmlEventIdentifier = 'form.control.change';
	}
	else if(domEventIdentifier == 'submit') {
		htmlEventIdentifier = 'form.submit';
	}
	else if(domEventIdentifier == 'keyup') {
		htmlEventIdentifier = 'keyboard.key.*.up';
	}
	else if(domEventIdentifier == 'keydown') {
		htmlEventIdentifier = 'keyboard.key.*.down';
	}
	else if(domEventIdentifier == 'keypress') {
		htmlEventIdentifier = 'keyboard.key.*.press';
	}

	return htmlEventIdentifier;
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

	// Get the DOM event identifier for the provided eventPattern
	var domEventIdentifier = HtmlEventProxy.htmlEventPatternToDomEventIdentifier(eventPattern);

	// When the DOM object emits a domEvent
	var domEventListenerFunctionToBind = function(domEvent) {
		// Take the domEvent identifier and turn it into an HtmlEventIdentifier
		var htmlEventIdentifier = HtmlEventProxy.domEventIdentifierToHtmlEventIdentifier(domEvent.type);
		//Console.log('domEvent.type', domEvent.type, 'htmlEventIdentifier', htmlEventIdentifier);

		// Create the proper event (MouseEvent for 'click', KeyboardEvent for 'keydown', etc.)
		var event = htmlEventEmitter.createEventFromDomEvent(domEvent, htmlEventEmitter, htmlEventIdentifier);

		// Set the common HtmlEvent properties
		event.domEvent = domEvent;
		event.trusted = domEvent.isTrusted;

		//Console.standardLog('event', event);

		// Emit the event
		htmlEventEmitter.emit(htmlEventIdentifier, event);
	}.bind(htmlEventEmitter);

	// If we have a valid domEventIdentifier
	if(domEventIdentifier) {
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