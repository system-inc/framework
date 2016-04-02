// Dependencies
var Event = Framework.require('system/events/Event.js');

// Class
var EventEmitter = Class.extend({

	/*
		[
			{
				eventPattern: ,
				boundFunction: ,
				timesToRun: ,
				timesRan: ,
			},
			...
		]
	*/
	eventListeners: [],

	recommendedMaximumEventListenersPerEventIdentifier: null,

	construct: function() {
		// Set the default recommended maximum bound functions per event pattern 
		this.recommendedMaximumEventListenersPerEventIdentifier = EventEmitter.defaultRecommendedMaximumEventListenersPerEventIdentifier;
	},

	on: function*(eventPattern, functionToBind, timesToRun) {
		var on = yield this.addEventListener(eventPattern, functionToBind, timesToRun);

		return on;
	},

	once: function*(eventPattern, functionToBind) {
		var once = yield this.addEventListener(eventPattern, functionToBind, 1);

		return once;
	},

	emit: function*(eventIdentifier, data) {
		// Default data to null
		if(data === undefined) {
			data = null;
		}

		// Allow multiple events to be emitted by passing in an array
		if(Array.is(eventIdentifier)) {
			yield eventIdentifier.each(function*(currentEventIdentifierIndex, currentEventIdentifier) {
				yield this.emit(currentEventIdentifier, data);
			}.bind(this));

			return this;
		}
		// Allow multiple events to be emitted separated by spaces or ", "
		else if(String.is(eventIdentifier) && (eventIdentifier.contains(' ') || eventIdentifier.contains(','))) {
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

		// Create the event to emit
		var event = new Event(eventIdentifier, data);

		// If there are no event listeners for an Error, throw the Error
		if(matchingEventListeners.length == 0 && Error.is(data)) {
			throw data;
		}
		// Run the matching bound functions
		else {
			// Run the bound functions in sequence
			yield matchingEventListeners.each(function*(matchingEventListenerIndex, matchingEventListener) {
				yield matchingEventListener.boundFunction(event);

				// Count the run
				matchingEventListener.timesRan++;

				// Unbind the function if the function has been run too many times
				if(matchingEventListener.timesRan == matchingEventListener.timesToRun) {
					//Console.info('Remove event listener after it has been run too many times', matchingEventListener, this.eventListeners.indexOf(matchingEventListener));
					this.eventListeners.delete(this.eventListeners.indexOf(matchingEventListener));
				}
			}.bind(this));	
		}

		return this;
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
		var eventListener = {
			eventPattern: eventPattern,
			boundFunction: functionToBind,
			timesToRun: timesToRun,
			timesRan: 0,
		};

		// Add the event listener
		this.eventListeners.append(eventListener);

		// All EventEmitters emit 'eventEmitter.addedEventListener' when an event listener is added
		yield this.emit('eventEmitter.addedEventListener', eventListener);

		// Check to see if the matching bound function objects is greater than the recommended
		var eventListeners = this.getEventListeners(eventPattern);
		if(eventListeners.length > this.recommendedMaximumEventListenersPerEventIdentifier) {
			Console.warn('Possible memory leak detected. There are '+eventListeners.length+' event listeners bound to the event pattern "'+eventPattern+'". The recommended maximum event listeners for this event pattern is '+this.recommendedMaximumEventListenersPerEventIdentifier+'.', "\n"+(new Error().stack.stackTraceToString()));
		}

		return this;
	},

	removeEventListener: function*(eventPattern, functionToUnbind) {
		// If we are unbinding a specific function for an event pattern
		if(functionToUnbind) {
			// Walk backwards through the array so we can edit the array in place
			for(var currentEventListenerIndex = this.eventListeners.length - 1; currentEventListenerIndex >= 0; currentEventListenerIndex--) {
				var currentEventListener = this.eventListeners[currentEventListenerIndex];
				//Console.info('currentEventListener', currentEventListener);

				// If the event pattern matches and the current bound function strictly matches
				if(currentEventListener.eventPattern == eventPattern && functionToUnbind === currentEventListener.boundFunction) {
					this.eventListeners.delete(currentEventListenerIndex);
					
					// All EventEmitters emit 'eventEmitter.removedEventListener' when an event listener is removed
					yield this.emit('eventEmitter.removedEventListener', currentEventListener);
				}
			}
		}
		// If we are unbinding all functions for a given event pattern
		else {
			// Walk backwards through the array so we can edit the array in place
			for(var currentEventListenerIndex = this.eventListeners.length - 1; currentEventListenerIndex >= 0; currentEventListenerIndex--) {
				var currentEventListener = this.eventListeners[currentEventListenerIndex];
				//Console.info('currentEventListener', currentEventListener);

				// If the event pattern matches
				if(currentEventListener.eventPattern == eventPattern) {
					this.eventListeners.delete(currentEventListenerIndex);

					// All EventEmitters emit 'eventEmitter.removedEventListener' when an event listener is removed
					yield this.emit('eventEmitter.removedEventListener', currentEventListener);
				}
			}
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
				// If the event pattern is a string with a *
				if(String.is(eventListener.eventPattern) && eventListener.eventPattern.contains('*')) {
					//Console.info('eventListener eventPattern contains *', eventListener);
					if(RegularExpression.stringMatchesWildcardPattern(eventPattern, eventListener.eventPattern)) {
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
				// The event pattern is just a regular string and is meant to be taken literally
				else if(eventListener.eventPattern == eventPattern) {
					matchingEventListeners.append(eventListener);
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