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

	emit: function*(eventIdentifier, data) {
		//Console.log('EventEmitter.emit', 'eventIdentifier', eventIdentifier, 'data', data);

		var matchingEventListeners = this.getEventListeners(eventIdentifier);

		// Need to check counts
		//// Loop through all callbacks synchronously backwards (so we can edit the array in place)
		//for(var currentListenersIndex = this.eventListeners.length; currentListenersIndex > -1; currentListenersIndex--) {
		//	var currentEventListenerObject = this.eventListeners[currentListenersIndex];

		//	// Run the function
		//	var result = yield boundFunctionObject.boundFunction(event);
		//	//Console.log('boundFunctionObject result', result);

		//	// Count the run
		//	boundFunctionObject.timesRan++;

		//	// Unbind the function if the function has been run too many times
		//	if(boundFunction.timesRan == boundFunctionObject.timesToRun) {
		//		this.unbindFunctionByListenersIndex(currentListenersIndex);
		//	}
		//}

		// Create the event to emit
		var event = new Event(eventIdentifier, data);

		// If there are no event listeners for an Error, throw the Error
		if(matchingEventListeners.length == 0 && Error.is(data)) {
			throw data;
		}
		// Run the matching bound functions in sequence
		else {
			yield matchingEventListeners.each(function*(matchingEventListenerIndex, matchingEventListenerObject) {
				yield matchingEventListenerObject.boundFunction(event);
			});	
		}		

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
			this.eventListeners.each(function(boundFunctionIndex, boundFunctionObject) {
				// If the event pattern is a string with a * or if the event pattern is a regular expression
				if((String.is(boundFunctionObject.eventPattern) && boundFunctionObject.eventPattern.contains('*')) || RegularExpression.is(boundFunctionObject.eventPattern)) {
					// TODO:
					//matchingEventListeners.append(boundFunctionObject);
				}
				// The event pattern is just a regular string and is meant to be taken literally
				else if(boundFunctionObject.eventPattern == eventPattern) {
					matchingEventListeners.append(boundFunctionObject);
				}
			});
		}

		return matchingEventListeners;
	},

	bind: function(eventPattern, functionToBind, timesToRun) {
		//Console.log('EventEmitter.bind', 'eventPattern', eventPattern, 'functionToBind', functionToBind, 'timesToRun', timesToRun);

		this.eventListeners.append({
			eventPattern: eventPattern,
			boundFunction: functionToBind,
			timesToRun: timesToRun,
			timesRan: 0,
		});

		var eventListeners = this.getEventListeners(eventPattern);

		// Check to see if the matching bound function objects is greater than the recommended
		if(eventListeners.length > this.recommendedMaximumEventListenersPerEventIdentifier) {
			Console.warn('Possible memory leak detected. There are '+eventListeners.length+' event listeners bound to the event pattern "'+eventPattern+'". The recommended maximum event listeners for this event pattern is '+this.recommendedMaximumEventListenersPerEventIdentifier+'.', "\n"+(new Error().stack.stackTraceToString()));
		}

		return this;
	},

	on: function(eventPattern, functionToBind, timesToRun) {
		return this.bind(eventPattern, functionToBind, timesToRun);
	},

	once: function(eventPattern, functionToBind) {
		return this.bind(eventPattern, functionToBind, 1);
	},

	unbind: function(eventPattern, functionToUnbind) {
		// If we are unbinding a specific function for an event pattern
		if(functionToUnbind) {
			// Walk backwards through the array so we can edit the array in place
			for(var currentEventListenerIndex = this.eventListeners.length - 1; currentEventListenerIndex >= 0; currentEventListenerIndex--) {
				var currentEventListener = this.eventListeners[currentEventListenerIndex];
				//Console.info('currentEventListener', currentEventListener);

				// If the event pattern matches and the current bound function strictly matches
				if(currentEventListener.eventPattern == eventPattern && functionToUnbind === currentEventListener.boundFunction) {
					this.eventListeners.delete(currentEventListenerIndex);
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
				}
			}
		}

		return this;
	},

	unbindAll: function() {
		this.eventListeners = [];

		return this;
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