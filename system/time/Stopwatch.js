// Class
class Stopwatch {

	precision = 'milliseconds';

	startTime = null;
	highResolutionStartTime = null;

	stopTime = null;
	highResolutionStopTime = null;

	elapsedTime = null;
	highResolutionElapsedTime = null;
	highResolutionElapsedTimeInNanoseconds = null;

	laps = [];
	time = null;

	constructor(options) {
		if(options && options.precision) {
			this.precision = options.precision;
		}

		this.time = new Time();
		this.time.setPrecision(this.precision);

		this.start();
	}

	start() {
		this.highResolutionStartTime = Node.Process.hrtime();
		this.startTime = this.time.now();

		return this;
	}

	stop() {
		this.highResolutionStopTime = Node.Process.hrtime();
		this.stopTime = this.time.now();

		this.highResolutionElapsedTime = [
			this.highResolutionStopTime[0] - this.highResolutionStartTime[0], // seconds
			this.highResolutionStopTime[1] - this.highResolutionStartTime[1], // nanoseconds
		];

		this.highResolutionElapsedTimeInNanoseconds =  (this.highResolutionElapsedTime[0] * 1e9) + this.highResolutionElapsedTime[1]; // (seconds * 1e9) + nanoseconds
		this.elapsedTime = this.stopTime - this.startTime;

		return this;
	}

	getHighResolutionElapsedTime(precision) {
		if(precision === undefined) {
			precision = this.precision;
		}

		var highResolutionElapsedTime = null;

		// Milliseconds
		if(precision == 'milliseconds') {
			highResolutionElapsedTime = this.highResolutionElapsedTimeInNanoseconds / 1000000;
		}
		// Microseconds
		else if(precision == 'microseconds') {
			highResolutionElapsedTime = this.highResolutionElapsedTimeInNanoseconds / 1000;
		}
		// Nanoseconds
		else if(precision == 'nanoseconds') {
			highResolutionElapsedTime = this.highResolutionElapsedTimeInNanoseconds;
		}

		return highResolutionElapsedTime;
	}

	lap(note) {
		var note = note === undefined ? null : note;
		var now = this.time.now();

		var elapsedTimeSinceLastLap = null;
		var lastLap = this.laps.last();
		if(lastLap) {
			elapsedTimeSinceLastLap = now - lastLap.time;
		}
		else {
			elapsedTimeSinceLastLap = now - this.startTime;
		}

		this.laps.append({
			'note': note,
			'time': now,
			'elapsedTimeSinceStart': now - this.startTime,
			'elapsedTimeSinceLastLap': elapsedTimeSinceLastLap,
		});

		return this;
	}

}

// Export
export default Stopwatch;
