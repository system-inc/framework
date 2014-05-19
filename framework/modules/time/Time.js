Time = Class.extend({

	construct: function(string) {
		this.time = new Date(string);
		this.precision = 'milliseconds';
	},

	setPrecision: function(precision) {
		this.precision = precision;
	},

	now: function() {
		var now = null;

		if(this.precision == 'milliseconds') {
			return this.nowInMilliseconds();
		}
		else if(this.precision == 'microseconds') {
			return this.nowInMicroseconds();
		}
		else if(this.precision == 'nanoseconds') {
			return this.nowInNanoseconds();
		}
		else if(this.precision == 'seconds') {
			return this.nowInSeconds();
		}
		
		return now;
	},

	nowInSeconds: function() {
		return this.nowInMilliseconds() / 1000;
	},

	nowInMilliseconds: function() {
		return new Date().getTime();
	},

	nowInMicroseconds: function() {
		var now = null;

		// If we have Node's hrtime
		if(process && process.hrtime) {
			var nodeHighResolutionTime = process.hrtime();
			now = nodeHighResolutionTime[0] * 1000000000 + nodeHighResolutionTime[1] / 1000;
		}
		else {
			now = new Date().getTime() * 1000;
		}

		return  now;
	},

	nowInNanoseconds: function() {
		var now = null;

		// If we have Node's hrtime
		if(process && process.hrtime) {
			var nodeHighResolutionTime = process.hrtime();
			now = nodeHighResolutionTime[0] * 1000000000 + nodeHighResolutionTime[1];
		}
		else {
			now = new Date().getTime() * 1000000;
		}

		return  now;
	},

});

// Static methods
Time.precision = 'milliseconds';
Time.now = Time.prototype.now;
Time.nowInMilliseconds = Time.prototype.nowInSeconds;
Time.nowInMilliseconds = Time.prototype.nowInMilliseconds;
Time.nowInMicroseconds = Time.prototype.nowInMicroseconds;