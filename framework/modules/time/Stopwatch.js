Stopwatch = Class.extend({

	precision: 'milliseconds',
	starTime: null,
	endTime: null,
	elapsedTime: null,
	laps: [],
	time: null,

	construct: function(options) {
		if(options && options.precision) {
			this.precision = options.precision;
		}

		this.time = new Time();
		this.time.setPrecision(this.precision);

		this.start();
	},

	start: function() {
		this.startTime = this.time.now();

		return this;
	},

	end: function() {
		this.endTime = this.time.now();
		this.elapsedTime = this.endTime - this.startTime;

		return this;
	},

	lap: function(note) {
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

		this.laps.push({
			'note': note,
			'time': now,
			'elapsedTimeSinceStart': now - this.starTime,
			'elapsedTimeSinceLastLap': elapsedTimeSinceLastLap,
		});

		return this;
	}

});