Time = Class.extend({

	time: null,
	precision: 'milliseconds',

	construct: function(string) {
		if(string != undefined) {
			this.time = new Date(string);
		}
		else {
			this.time = new Date();
		}
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
		var now = null;

		// If we have Node's hrtime
		if(process && process.hrtime) {
			var nodeHighResolutionTime = process.hrtime();
			now = nodeHighResolutionTime[0] * 1000 + nodeHighResolutionTime[1] / 1000000;
		}
		else {
			now = new Date().getTime();
		}

		return now;
	},

	nowInMicroseconds: function() {
		var now = null;

		// If we have Node's hrtime
		if(process && process.hrtime) {
			var nodeHighResolutionTime = process.hrtime();
			now = nodeHighResolutionTime[0] * 1000000 + nodeHighResolutionTime[1] / 1000;
		}
		else {
			now = new Date().getTime() * 1000;
		}

		return now;
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

	getYear: function() {
		return this.time.getFullYear();
	},

	getMonth: function() {
		return this.time.getMonth() + 1;
	},

	getMonthPadded: function() {
		return ('0'+(this.time.getMonth() + 1)).slice(-2);
	},

	getMonthName: function() {
		var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return monthNames[this.time.getMonth()];
	},

	getDay: function() {
		return this.time.getDate();
	},

	getDayPadded: function() {
		return ('0'+this.time.getDate()).slice(-2);
	},

	getDayName: function() {
		var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		return dayNames[this.time.getDay()];
	},

	getWeekDay: function() {
		return this.time.getDay() + 1;
	},

	getHour: function() {
		return this.time.getHours() + 1;
	},

	getHourPadded: function() {
		return ('0'+(this.time.getHours() + 1)).slice(-2);
	},

	getMinute: function() {
		return this.time.getMinutes() + 1;
	},

	getMinutePadded: function() {
		return ('0'+(this.time.getMinutes() + 1)).slice(-2);
	},

	getSecond: function() {
		return this.time.getSeconds() + 1;
	},

	getSecondPadded: function() {
		return ('0'+(this.time.getSeconds() + 1)).slice(-2);
	},

	getDateTime: function() {
		var dateTime = this.getYear();
		dateTime += '-'+this.getMonthPadded();
		dateTime += '-'+this.getDayPadded();
		dateTime += ' '+this.getHourPadded();
		dateTime += ':'+this.getMinutePadded();
		dateTime += ':'+this.getSecondPadded();

		return dateTime;
	},

});

// Static methods
Time.precision = 'milliseconds';
Time.now = Time.prototype.now;
Time.nowInMilliseconds = Time.prototype.nowInSeconds;
Time.nowInMilliseconds = Time.prototype.nowInMilliseconds;
Time.nowInMicroseconds = Time.prototype.nowInMicroseconds;