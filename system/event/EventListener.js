// Class
class EventListener {

	eventPattern = null;
	boundFunction = null;
	timesToRun = null;
	timesRan = 0;

	constructor(eventPattern, boundFunction, timesToRun) {
		this.eventPattern = eventPattern;
		this.boundFunction = boundFunction;
		this.timesToRun = timesToRun;
	}

}

// Export
export { EventListener };
