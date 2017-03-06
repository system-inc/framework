// Dependencies
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';
import WildcardPatternMatcher from 'framework/system/search/patterns/WildcardPatternMatcher.js';
import HtmlDocumentEvent from 'framework/system/interface/graphical/web/html/events/html-document/HtmlDocumentEvent.js';
import HtmlDocumentEventEmitter from 'framework/system/interface/graphical/web/html/events/html-document/HtmlDocumentEventEmitter.js';
import HtmlElementEvent from 'framework/system/interface/graphical/web/html/events/html-element/HtmlElementEvent.js';
import ClipboardEvent from 'framework/system/interface/graphical/web/html/events/html-event/ClipboardEvent.js';
import InputComposeEvent from 'framework/system/interface/graphical/web/html/events/html-element/input/InputComposeEvent.js';
import InputHoverEvent from 'framework/system/interface/graphical/web/html/events/html-element/input/InputHoverEvent.js';
import InputKeyEvent from 'framework/system/interface/graphical/web/html/events/html-element/input/InputKeyEvent.js';
import InputPressEvent from 'framework/system/interface/graphical/web/html/events/html-element/input/InputPressEvent.js';
import InputScrollEvent from 'framework/system/interface/graphical/web/html/events/html-element/input/InputScrollEvent.js';
import InputSelectEvent from 'framework/system/interface/graphical/web/html/events/html-element/input/InputSelectEvent.js';
import FormEvent from 'framework/system/interface/graphical/web/html/events/html-element/FormEvent.js';
import HtmlDocument from 'framework/system/interface/graphical/web/html/HtmlDocument.js';
import HtmlNode from 'framework/system/interface/graphical/web/html/HtmlNode.js';

// Class
class HtmlEventProxy {

	static domEventIdentifierMap = {
		// htmlDocument.*
		readystatechange: {
			eventClass: HtmlDocumentEvent,
			eventPatterns: {
				'htmlDocument.(loading|ready|load)': true,
			},
		},
		hashchange: {
			eventClass: HtmlDocumentEvent,
			eventPatterns: {
				'htmlDocument.url.fragment.change': true,
			},
		},
		beforeunload: {
			eventClass: HtmlDocumentEvent,
			eventPatterns: {
				'htmlDocument.unload.before': true,
			},
		},
		resize: {
			eventClass: HtmlDocumentEvent,
			eventPatterns: {
				'htmlDocument.resize': true,
			},
		},
		webkitfullscreenchange: {
			eventClass: HtmlDocumentEvent,
			eventPatterns: {
				'htmlDocument.fullScreen': true,
				'htmlDocument.fullScreen.exit': true,
			},
		},
		webkitfullscreenerror: {
			eventClass: HtmlDocumentEvent,
			eventPatterns: {
				'htmlDocument.fullScreen.error': true,
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
				'input.key.*(alt|command|control|meta|windows)': true,
			},
		},
		keyup: {
			eventClass: InputKeyEvent,
			eventPatterns: {
				'input.key.*.up': true,
				'input.key.*(alt|command|control|meta|shift|windows|up|down|left|right|backspace|delete|insert|contextMenu|escape)': true,
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

	// Takes HtmlEvent patterns (e.g., 'input.press.secondary.down') and returns the correlating DOM event identifiers (e.g., 'keydown')
	static htmlEventPatternToDomEventIdentifiers(htmlEventPattern) {
		var domEventIdentifiers = [];

		//app.log('HtmlEventProxy.htmlEventPatternToDomEventIdentifiers', htmlEventPattern);

		HtmlEventProxy.domEventIdentifierMap.each(function(domEventIdentifier, domEventIdentifierObject) {
			domEventIdentifierObject.eventPatterns.each(function(eventPattern) {
				if(WildcardPatternMatcher.match(htmlEventPattern, eventPattern)) {
					domEventIdentifiers.append(domEventIdentifier);	
				}
			});
		});

		// Get rid of duplicates
		domEventIdentifiers = domEventIdentifiers.unique();

		return domEventIdentifiers;
	}

	static createEventsFromDomEvent(domEvent, emitter) {
		//console.warn('HtmlEventEmitter createEventFromDomEvent arguments', arguments);

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
			console.error('No class specified', sourceEmitter, domEvent);
			events.append(emitter.createEvent(sourceEmitter, domEvent.type));
		}

		// Set the common HtmlEvent properties
		events.each(function(eventIndex, event) {
			// Do not allow the custom event to bubble, rather, the domEvent will bubble and custom events will be created as it bubbles
			event.stopPropagation();

			event.domEvent = domEvent;
			event.trusted = domEvent.isTrusted;
		});

		//console.warn('HtmlEventProxy.createEventFromDomEvent events created', events);

		return events;
	}

	static getDomObjectForHtmlEventEmitterAndDomEventIdentifier(htmlEventEmitter, domEventIdentifier) {
		var domObject = null;

		// Set the domObject
		// Deal with HtmlDocument events
		if(HtmlDocument.is(htmlEventEmitter)) {
			// window events
			if(
				domEventIdentifier == 'resize' ||
				domEventIdentifier == 'beforeunload' ||
				domEventIdentifier == 'hashchange'
			) {
				domObject = htmlEventEmitter.domDocument.defaultView; // window
			}
			// body events
			//else if(
				
			//) {
			//	domObject = htmlEventEmitter.domDocument.body;
			//}
			// document events
			else {
				domObject = htmlEventEmitter.domDocument;
			}
		}
		else if(HtmlNode.is(htmlEventEmitter)) {
			domObject = htmlEventEmitter.domNode;
		}

		return domObject;
	}

	static warnAboutCommonEventPatternMistakes(eventPattern) {
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
			console.warn('Event listener not bound for "'+eventPattern+'". You must use', map[eventPattern], 'instead of "'+eventPattern+'".');
			//throw new Error('Event listener not bound for "'+eventPattern+'". You must use '+map[eventPattern]+' instead of "'+eventPattern+'".');
		}
	}

	static addEventListener(eventPattern, functionToBind, timesToRun, htmlEventEmitter) {
		//console.info('addEventListener eventPattern', eventPattern);

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
			console.error('No event emitter', eventPattern);
		}

		// Warn about common event pattern mistakes
		HtmlEventProxy.warnAboutCommonEventPatternMistakes(eventPattern);

		// Add the event listener to the htmlEventEmitter, use HtmlEventEmitter's super class, PropagatingEventEmitter, as opposed to htmlEventEmitter or HtmlEventEmitter, as to not cause an infinite loop
		PropagatingEventEmitter.prototype.addEventListener.apply(htmlEventEmitter, arguments);

		// Get the DOM event identifiers for the provided eventPattern
		var domEventIdentifiers = HtmlEventProxy.htmlEventPatternToDomEventIdentifiers(eventPattern);

		// Determine which event to use for mountedOnDom
		var mountedToDomEventIdentifier = 'htmlNode.mountedToDom';
		if(Class.isInstance(htmlEventEmitter, HtmlDocumentEventEmitter)) {
			mountedToDomEventIdentifier = 'htmlDocument.mountedToDom';
		}

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
			//console.log('events', events);

			// Emit the event
			events.each(function(eventIndex, event) {
				//console.log('htmlEventEmitter.emit event', event);
				htmlEventEmitter.emit(event.identifier, event);
			});

			// Return the value of the last event
			var lastEventReturnPreviousReturnValue = events.last().previousReturnValue;
			if(lastEventReturnPreviousReturnValue !== undefined) {
				//domEvent.returnValue = lastEventReturnPreviousReturnValue;
				return lastEventReturnPreviousReturnValue;
			}
		};

		// If we have a valid domEventIdentifier
		if(domEventIdentifiers.length) {
			domEventIdentifiers.each(function(domEventIdentifierIndex, domEventIdentifier) {
				// Don't add duplicate DOM object event listeners, we can just use one
				if(!htmlEventEmitter.eventListenersOnDomObject[domEventIdentifier]) {
					// Get the domObject from the htmlEventEmitter
					var domObject = HtmlEventProxy.getDomObjectForHtmlEventEmitterAndDomEventIdentifier(htmlEventEmitter, domEventIdentifier);

					//console.log('Binding domEventIdentifier "'+domEventIdentifier+'" to DOM object will use for eventPattern "'+eventPattern+'"');
					//console.log('domObject', domObject);

					// Keep track of which DOM object event listeners we have added
					htmlEventEmitter.eventListenersOnDomObject[domEventIdentifier] = {
						domObject: domObject,
						boundFunction: domEventListenerFunctionToBind,
						count: 1,
					};

					// If we have a domObject because we are already mounted to the DOM
					if(domObject) {
						// Add the event listener to the domObject
						domObject.addEventListener(domEventIdentifier, domEventListenerFunctionToBind);
					}
					// If we don't have a domObject, wait to be mountedToDom
					else {
						htmlEventEmitter.on(mountedToDomEventIdentifier, function(event) {
							//console.info(event.identifier, event, 'Mounted to DOM, calling domOjbect.addEventListener now for', htmlEventEmitter.tag, Json.encode(htmlEventEmitter.attributes));

							// Get the domObject from the htmlEventEmitter
							domObject = HtmlEventProxy.getDomObjectForHtmlEventEmitterAndDomEventIdentifier(htmlEventEmitter, domEventIdentifier);

							// Update the domObject on the htmlEventEmitter.eventListenersOnDomObject
							htmlEventEmitter.eventListenersOnDomObject[domEventIdentifier].domObject = domObject;

							// Add the event listener to the domObject
							domObject.addEventListener(domEventIdentifier, domEventListenerFunctionToBind);
						}.bind(htmlEventEmitter));
					}
				}
				else {
					htmlEventEmitter.eventListenersOnDomObject[domEventIdentifier].count++;
					//console.log('Already bound domEventIdentifier "'+domEventIdentifier+'" to DOM object, will use the existing one for eventPattern "'+eventPattern+'"');
					//console.log(domEventIdentifier, htmlEventEmitter.eventListenersOnDomObject[domEventIdentifier]);
				}
			});
		}
		// If we don't have a domEventIdentifier it means the event listener is not for the DOM
		else {
			var common = [
				'htmlDocument.mountedToDom',
				'htmlNode.mountedToDom',
				'htmlNode.domUpdateExecuted',
				'htmlDocument.domUpdatesExecuted',
				'testGraphicalInterfaceApp.runTestMethod',
			];
			if(!common.contains(eventPattern)) {
				console.log('No domEventIdentifier found for "'+eventPattern+'", the eventPattern must not be for a standard event.');
			}
		}

		return htmlEventEmitter;
	}

	static async removeEventListener(eventPattern, functionToUnbind, htmlEventEmitter) {
		// Get the DOM event identifiers for the provided eventPattern
		var domEventIdentifiers = HtmlEventProxy.htmlEventPatternToDomEventIdentifiers(eventPattern);

		//console.log('Need to remove domEventIdentifiers', domEventIdentifiers, 'for pattern', eventPattern);

		// Determine how many events will be unbound
		var eventPatternCount = null;

		// If we are unbinding a specific function
		if(functionToUnbind) {
			eventPatternCount = 1;
		}
		// If we want to unbind all of the functions for a given event pattern
		else {
			var eventsToBeUnbound = htmlEventEmitter.getEventListeners(eventPattern);
			eventPatternCount = eventsToBeUnbound.length;
			console.warn('We will be unbinding', eventPatternCount, 'events for', eventPattern);
			app.log(eventsToBeUnbound);
		}

		// Loop through each DOM event identifier for the given event pattern
		domEventIdentifiers.each(function(domEventIdentifierIndex, domEventIdentifier) {
			var domEventListenerData = htmlEventEmitter.eventListenersOnDomObject[domEventIdentifier];

			// Make sure we have the DOM event listener data
			if(domEventListenerData) {
				// Decrement the listener count
				domEventListenerData.count = domEventListenerData.count - eventPatternCount;

				// If there are no more listeners, remove the DOM event listener
				if(domEventListenerData.count == 0) {
					// Remove the event listener
					domEventListenerData.domObject.removeEventListener(domEventIdentifier, domEventListenerData.boundFunction);

					// Remove the domEventListenerData
					delete htmlEventEmitter.eventListenersOnDomObject[domEventIdentifier];
				}
			}
		});

		var result = await PropagatingEventEmitter.prototype.removeEventListener.call(htmlEventEmitter, eventPattern, functionToUnbind);

		return result;
	}

	static removeAllEventListeners(htmlEventEmitter) {
		// Remove each of the event listeners from the DOM object
		htmlEventEmitter.eventListenersOnDomObject.each(function(domEventIdentifier, domEventListenerData) {
			//console.info('HtmlEventProxy.removeAllEventListeners', domEventIdentifier, domEventListenerData);
			// Remove the event listener
			domEventListenerData.domObject.removeEventListener(domEventIdentifier, domEventListenerData.boundFunction);
		});

		// Empty eventListenersOnDomObject
		htmlEventEmitter.eventListenersOnDomObject = {};

		return PropagatingEventEmitter.prototype.removeAllEventListeners.call(htmlEventEmitter);
	}

}

// Export
export default HtmlEventProxy;
