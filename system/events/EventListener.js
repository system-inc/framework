// Class
var EventListener = Class.extend({

	eventPattern: null,
	boundFunction: null,
	timesToRun: null,
	timesRan: 0,

	construct: function(eventPattern, boundFunction, timesToRun) {
		this.eventPattern = eventPattern;
		this.boundFunction = boundFunction;
		this.timesToRun = timesToRun;
	},

});

// Export
module.exports = EventListener;