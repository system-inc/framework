// Dependencies
import Event from './Event.js';
import EventListener from './EventListener.js';
import WildcardPatternMatcher from './../../system/search/patterns/WildcardPatternMatcher.js';

// Class
class EventEmitter {

	eventClass = Event;

	eventListeners = [];

	recommendedMaximumEventListenersPerEventIdentifier = null;

	async on(eventPattern, functionToBind, timesToRun) {
		//console.log('EventEmitter on', eventPattern, this.tag, Json.encode(this.attributes));

		var on = await this.addEventListener(eventPattern, functionToBind, timesToRun);

		return on;
	}

	async once(eventPattern, functionToBind) {
		var once = await this.addEventListener(eventPattern, functionToBind, 1);

		return once;
	}

	async emit(eventIdentifier, data, eventOptions) {
		//app.warn('EventEmitter.emit', eventIdentifier, eventOptions);

		// Default data to null
		if(data === undefined) {
			data = null;
		}

		// Allow multiple events to be emitted by passing in an array
		if(Array.is(eventIdentifier)) {
			//app.error('eventIdentifier is an array will multiple eventPatterns to emit');
			await eventIdentifier.each(async function(currentEventIdentifierIndex, currentEventIdentifier) {
				await this.emit(currentEventIdentifier, data);
			}.bind(this));

			return this;
		}
		// Allow multiple events to be emitted separated by spaces or ", "
		else if(String.is(eventIdentifier) && (eventIdentifier.contains(' ') || eventIdentifier.contains(','))) {
			//app.error('eventIdentifier is a string will multiple eventPatterns to emit');

			eventIdentifier = eventIdentifier.replace(', ', ' ');
			eventIdentifier = eventIdentifier.replace(',', ' ');
			var eventIdentifierArray = eventIdentifier.split(' ');

			await eventIdentifierArray.each(async function(currentEventIdentifierIndex, currentEventIdentifier) {
				await this.emit(currentEventIdentifier, data);
			}.bind(this));

			return this;
		}

		//console.log('EventEmitter.emit', 'eventIdentifier', eventIdentifier);

		var matchingEventListeners = this.getEventListeners(eventIdentifier);
		//console.log('matchingEventListeners', matchingEventListeners);

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
			await matchingEventListeners.each(async function(matchingEventListenerIndex, matchingEventListener) {
				event.previousReturnValue = await matchingEventListener.boundFunction(event);

				// Count the run
				matchingEventListener.timesRan++;

				// Unbind the function if the function has been run too many times
				if(matchingEventListener.timesRan == matchingEventListener.timesToRun) {
					//app.info('Remove event listener after it has been run too many times', matchingEventListener, this.eventListeners.indexOf(matchingEventListener));
					this.eventListeners.delete(this.eventListeners.indexOf(matchingEventListener));
				}

				// Check to see if event.stop() was called
				if(event.stopped) {
					//console.log('event stopped!', eventIdentifier);
					return false; // break
				}
			}.bind(this));	
		}

		return event;
	}

	createEvent(emitter, eventIdentifier, data, eventOptions) {
		var event = new this.eventClass(emitter, eventIdentifier, data, eventOptions);

		return event;
	}

	async addEventListener(eventPattern, functionToBind, timesToRun) {
		//console.log('EventEmitter.bind', 'eventPattern', eventPattern, 'functionToBind', functionToBind, 'timesToRun', timesToRun);

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
			this.recommendedMaximumEventListenersPerEventIdentifier = EventEmitter.defaultRecommendedMaximumEventListenersPerEventIdentifier;
		}

		if(eventListeners.length > this.recommendedMaximumEventListenersPerEventIdentifier) {
			app.warn('Possible memory leak detected. There are '+eventListeners.length+' event listeners bound to the event pattern "'+eventPattern+'". The recommended maximum event listeners for this event pattern is '+this.recommendedMaximumEventListenersPerEventIdentifier+'.', "\n"+(new Error().stack.stackTraceToString()));
		}

		// Do this await at the end of the function
		// All EventEmitters emit 'eventEmitter.addedEventListener' when an event listener is added
		await this.emit('eventEmitter.addedEventListener', eventListener); // This bubbles

		return this;
	}

	async removeEventListener(eventPattern, functionToUnbind) {
		//Console.standardLog('removeEventListener', eventPattern, functionToUnbind);

		var removedEventListeners = [];

		// Walk backwards through the array so we can edit the array in place
		for(var currentEventListenerIndex = this.eventListeners.length - 1; currentEventListenerIndex >= 0; currentEventListenerIndex--) {
			var currentEventListener = this.eventListeners[currentEventListenerIndex];
			//app.info('currentEventListener', currentEventListener);
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

		// Do this await at the end of the function
		// All EventEmitters emit 'eventEmitter.removedEventListener' when an event listener is removed
		// Walk backward through the removed event listeners to emit them in order
		for(var currentEventListenerIndex = removedEventListeners.length - 1; currentEventListenerIndex >= 0; currentEventListenerIndex--) {
			var currentEventListener = removedEventListeners[currentEventListenerIndex];
			await this.emit('eventEmitter.removedEventListener', currentEventListener); // This bubbles
		}

		return this;
	}

	removeAllEventListeners() {
		this.eventListeners = [];

		return this;
	}

	getEventListeners(eventPattern) {
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
					if(WildcardPatternMatcher.match(eventPattern, eventListener.eventPattern)) {
						matchingEventListeners.append(eventListener);
					}
				}
				// If the event pattern is a regular expression
				else if(RegularExpression.is(eventListener.eventPattern)) {
					// If the event pattern is also a regular expression
					if(RegularExpression.is(eventPattern)) {
						// If the regular expressions are the same
						if(RegularExpression.equal(eventListener.eventPattern, eventPattern)) {
							//app.info('eventListener.eventPattern and eventPattern are both regular expressions and are the same');
							matchingEventListeners.append(eventListener);
						}
					}
					// If the event pattern is a string
					else {
						//app.info('eventListener.eventPattern is a regular expression and eventPattern is a string');
						if(eventListener.eventPattern.test(eventPattern)) {
							matchingEventListeners.append(eventListener);
						}
					}					
				}
			});
		}

		return matchingEventListeners;
	}

	/*
		By default, the recommended maximum of functions that can be bound to any single event is 10. This recommended limit can be changed for individual
		EventEmitter instances using the eventEmitter.setRecommendedMaximumListenersPerEventIdentifier(n) method. To change the default for all EventEmitter
		instances, the EventEmitter.defaultRecommendedMaximumEventListenersPerEventIdentifier property can be used. Note that this is not a hard limit.
		EventEmitter instances will allow more functions to be bound but will output a warning indicating that a possible EventEmitter memory leak has been detected.
		For any single EventEmitter, the eventEmitter.setRecommendedMaximumListenersPerEventIdentifier method can be used to avoid this warning.
	*/
	static defaultRecommendedMaximumEventListenersPerEventIdentifier = 10;

}

// Export
export default EventEmitter;
