// Dependencies
var Event = Framework.require('system/events/Event.js');
var EventListener = Framework.require('system/events/EventListener.js');

// Class
var EventEmitter = Class.extend({

	eventClass: Event,

	eventListeners: [],

	recommendedMaximumEventListenersPerEventIdentifier: null,

	on: function*(eventPattern, functionToBind, timesToRun) {
		//Console.log('EventEmitter on', eventPattern, this.tag, Json.encode(this.attributes));

		var on = yield this.addEventListener(eventPattern, functionToBind, timesToRun);

		return on;
	},

	once: function*(eventPattern, functionToBind) {
		var once = yield this.addEventListener(eventPattern, functionToBind, 1);

		return once;
	},

	emit: function*(eventIdentifier, data, eventOptions) {
		//Console.warn('EventEmitter.emit', eventIdentifier, eventOptions);

		// Default data to null
		if(data === undefined) {
			data = null;
		}

		// Allow multiple events to be emitted by passing in an array
		if(Array.is(eventIdentifier)) {
			//Console.error('eventIdentifier is an array will multiple eventPatterns to emit');
			yield eventIdentifier.each(function*(currentEventIdentifierIndex, currentEventIdentifier) {
				yield this.emit(currentEventIdentifier, data);
			}.bind(this));

			return this;
		}
		// Allow multiple events to be emitted separated by spaces or ", "
		else if(String.is(eventIdentifier) && (eventIdentifier.contains(' ') || eventIdentifier.contains(','))) {
			//Console.error('eventIdentifier is a string will multiple eventPatterns to emit');

			eventIdentifier = eventIdentifier.replace(', ', ' ');
			eventIdentifier = eventIdentifier.replace(',', ' ');
			var eventIdentifierArray = eventIdentifier.split(' ');

			yield eventIdentifierArray.each(function*(currentEventIdentifierIndex, currentEventIdentifier) {
				yield this.emit(currentEventIdentifier, data);
			}.bind(this));

			return this;
		}

		//Console.log('EventEmitter.emit', 'eventIdentifier', eventIdentifier, 'data', data);

		var matchingEventListeners = this.getEventListeners(eventIdentifier);
		//Console.info('matchingEventListeners', matchingEventListeners);

		// Create reference to the event to emit
		var event = null

		// If there are no event listeners for an Error, throw the Error
		if(matchingEventListeners.length == 0 && Error.is(data)) {
			throw data;
		}
		// Run the matching bound functions
		else {
			// If data is an Event, use it as the event
			if(Event.is(data)) {
				event = data;
			}
			// If data is not an event, create a new instance of Event
			else {
				event = this.createEvent(this, eventIdentifier, data, eventOptions);
			}

			// Set the currentEmitter
			if(event.currentEmitter !== this) {
				event.currentEmitter = this;
			}
			
			// Run the bound functions in sequence
			yield matchingEventListeners.each(function*(matchingEventListenerIndex, matchingEventListener) {
				event.previousReturnValue = yield matchingEventListener.boundFunction(event);

				// Count the run
				matchingEventListener.timesRan++;

				// Unbind the function if the function has been run too many times
				if(matchingEventListener.timesRan == matchingEventListener.timesToRun) {
					//Console.info('Remove event listener after it has been run too many times', matchingEventListener, this.eventListeners.indexOf(matchingEventListener));
					this.eventListeners.delete(this.eventListeners.indexOf(matchingEventListener));
				}

				// Check to see if event.stop() was called
				if(event.stopped) {
					return false; // break
				}
			}.bind(this));	
		}

		return event;
	},

	createEvent: function(emitter, eventIdentifier, data, eventOptions) {
		var event = new this.eventClass(emitter, eventIdentifier, data, eventOptions);

		return event;
	},

	addEventListener: function*(eventPattern, functionToBind, timesToRun) {
		//Console.log('EventEmitter.bind', 'eventPattern', eventPattern, 'functionToBind', functionToBind, 'timesToRun', timesToRun);

		// Allow multiple events to be registered by passing in an array
		if(Array.is(eventPattern)) {
			eventPattern.each(function(currentEventPatternIndex, currentEventPattern) {
				this.addEventListener(currentEventPattern, functionToBind, timesToRun);
			}.bind(this));

			return this;
		}
		// Allow multiple events to be registered separated by spaces or ", "
		else if(String.is(eventPattern) && (eventPattern.contains(' ') || eventPattern.contains(','))) {
			eventPattern = eventPattern.replace(', ', ' ');
			eventPattern = eventPattern.replace(',', ' ');
			var eventPatternArray = eventPattern.split(' ');

			eventPatternArray.each(function(currentEventPatternIndex, currentEventPattern) {
				this.addEventListener(currentEventPattern, functionToBind, timesToRun);
			}.bind(this));

			return this;
		}

		// Default timesToRun to null
		if(timesToRun === undefined) {
			timesToRun = null;
		}

		// Create the event listener
		var eventListener = new EventListener(eventPattern, functionToBind, timesToRun);

		// Add the event listener
		this.eventListeners.append(eventListener);

		// Check to see if the matching bound function objects is greater than the recommended
		var eventListeners = this.getEventListeners(eventPattern);

		// Make sure this.recommendedMaximumEventListenersPerEventIdentifier is initialized
		if(this.recommendedMaximumEventListenersPerEventIdentifier === null) {
			this.setRecommendedMaximumListenersPerEventIdentifier(EventEmitter.defaultRecommendedMaximumEventListenersPerEventIdentifier);
		}

		if(eventListeners.length > this.recommendedMaximumEventListenersPerEventIdentifier) {
			Console.warn('Possible memory leak detected. There are '+eventListeners.length+' event listeners bound to the event pattern "'+eventPattern+'". The recommended maximum event listeners for this event pattern is '+this.recommendedMaximumEventListenersPerEventIdentifier+'.', "\n"+(new Error().stack.stackTraceToString()));
		}

		// Do this yield at the end of the function
		// All EventEmitters emit 'eventEmitter.addedEventListener' when an event listener is added
		yield this.emit('eventEmitter.addedEventListener', eventListener); // This bubbles

		return this;
	},

	removeEventListener: function*(eventPattern, functionToUnbind) {
		//Console.standardLog('removeEventListener', eventPattern, functionToUnbind);

		var removedEventListeners = [];

		// Walk backwards through the array so we can edit the array in place
		for(var currentEventListenerIndex = this.eventListeners.length - 1; currentEventListenerIndex >= 0; currentEventListenerIndex--) {
			var currentEventListener = this.eventListeners[currentEventListenerIndex];
			//Console.info('currentEventListener', currentEventListener);
			var shouldRemoveCurrentEventListener = false;
			  
			if(
				// If we are unbinding a specific function for an event pattern
				functionToUnbind !== undefined &&
				// and the event pattern matches
				currentEventListener.eventPattern == eventPattern &&
				// and the current bound function strictly matches
				functionToUnbind === currentEventListener.boundFunction
			) {
				shouldRemoveCurrentEventListener = true;
			}
			// If we are removing all matching event patterns because no functionToUnbind was specified
			else if(functionToUnbind === undefined && currentEventListener.eventPattern == eventPattern) {
				shouldRemoveCurrentEventListener = true;
			}

			if(shouldRemoveCurrentEventListener) {
				this.eventListeners.delete(currentEventListenerIndex);
				removedEventListeners.append(currentEventListener);	
			}
		}

		//Console.standardLog('removedEventListeners', removedEventListeners);

		// Do this yield at the end of the function
		// All EventEmitters emit 'eventEmitter.removedEventListener' when an event listener is removed
		// Walk backward through the removed event listeners to emit them in order
		for(var currentEventListenerIndex = removedEventListeners.length - 1; currentEventListenerIndex >= 0; currentEventListenerIndex--) {
			var currentEventListener = removedEventListeners[currentEventListenerIndex];
			yield this.emit('eventEmitter.removedEventListener', currentEventListener); // This bubbles
		}

		return this;
	},

	removeAllEventListeners: function() {
		this.eventListeners = [];

		return this;
	},

	getEventListeners: function(eventPattern) {
		// Create a place to store all of the matching bound function objects
		var matchingEventListeners = [];

		// Return all bound functions if there is no event pattern provided
		if(!eventPattern) {
			matchingEventListeners = this.eventListeners;
		}
		else {
			// Gather all of the matching bound function objects
			this.eventListeners.each(function(eventListenersIndex, eventListener) {
				// The event pattern strictly matches
				if(eventListener.eventPattern === eventPattern) {
					matchingEventListeners.append(eventListener);
				}
				// If the event patterns are strings
				else if(String.is(eventListener.eventPattern) && String.is(eventPattern)) {
					if(RegularExpression.wildcardPatternsMatch(eventPattern, eventListener.eventPattern)) {
						matchingEventListeners.append(eventListener);
					}
				}
				// If the event pattern is a regular expression
				else if(RegularExpression.is(eventListener.eventPattern)) {
					// If the event pattern is also a regular expression
					if(RegularExpression.is(eventPattern)) {
						// If the regular expressions are the same
						if(RegularExpression.equal(eventListener.eventPattern, eventPattern)) {
							//Console.info('eventListener.eventPattern and eventPattern are both regular expressions and are the same');
							matchingEventListeners.append(eventListener);
						}
					}
					// If the event pattern is a string
					else {
						//Console.info('eventListener.eventPattern is a regular expression and eventPattern is a string');
						if(eventListener.eventPattern.test(eventPattern)) {
							matchingEventListeners.append(eventListener);
						}
					}					
				}
			});
		}

		return matchingEventListeners;
	},

	setRecommendedMaximumListenersPerEventIdentifier: function(recommendedMaximumEventListenersPerEventIdentifier) {
		this.recommendedMaximumEventListenersPerEventIdentifier = recommendedMaximumEventListenersPerEventIdentifier;

		return this.recommendedMaximumEventListenersPerEventIdentifier;
	},

});

// Static properties

/*
	By default, the recommended maximum of functions that can be bound to any single event is 10. This recommended limit can be changed for individual
	EventEmitter instances using the eventEmitter.setRecommendedMaximumListenersPerEventIdentifier(n) method. To change the default for all EventEmitter
	instances, the EventEmitter.defaultRecommendedMaximumEventListenersPerEventIdentifier property can be used. Note that this is not a hard limit.
	EventEmitter instances will allow more functions to be bound but will output a warning indicating that a possible EventEmitter memory leak has been detected.
	For any single EventEmitter, the eventEmitter.setRecommendedMaximumListenersPerEventIdentifier method can be used to avoid this warning.
*/
EventEmitter.defaultRecommendedMaximumEventListenersPerEventIdentifier = 10;

// Export
module.exports = EventEmitter;