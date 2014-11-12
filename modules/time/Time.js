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
		var now = new Date().getTime();

		return now;
	},

	nowInMicroseconds: function() {
		var now = new Date().getTime() * 1000;

		return now;
	},

	nowInNanoseconds: function() {
		var now = new Date().getTime() * 1000000;

		return  now;
	},

	getShortTime: function() {
		var shortTime = '';

		shortTime += this.getHour12Padded();
		shortTime += ':'+this.getMinutePadded();
		shortTime += ' '+this.getPeriod();

		return shortTime;
	},

	getLongTime: function() {
		var longTime = '';

		longTime += this.getHour12Padded();
		longTime += ':'+this.getMinutePadded();
		longTime += ':'+this.getSecondPadded();
		longTime += ' '+this.getPeriod();

		return longTime;
	},

	getPeriod: function() {
		var period = 'AM';

		var hours = this.time.getHours();
        if(hours > 11) {
            period = 'PM';
        }

        return period;
	},

	getDayWithDate: function() {
		// Monday, January 1, 2014
		var dayWithDate = '';

		dayWithDate += this.getDayName()+', ';
		dayWithDate += this.getMonthName()+' ';
		dayWithDate += this.getDay()+', ';
		dayWithDate += this.getYear();

		return dayWithDate;
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

	getHour12: function() {
		var hour = this.time.getHours();

		if(hour > 11) {
            hour = hour - 12;
        }
        if(hour == 0) {
            hour = 12;
        }

        return hour;
	},

	getHour12Padded: function() {
        return ('0'+this.getHour12()).slice(-2);
	},

	getHour: function() {
		return this.time.getHours() + 1;
	},

	getHourPadded: function() {
		return ('0'+(this.time.getHours() + 1)).slice(-2);
	},

	getMinute: function() {
		return this.time.getMinutes();
	},

	getMinutePadded: function() {
		return ('0'+(this.time.getMinutes())).slice(-2);
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

	// The number of seconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970
	getUnixTime: function() {
		return this.nowInSeconds().toFixed(0);
	},

	// The number of milliseconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970
	getUnixTimeInMilliseconds: function() {
		return this.nowInMilliseconds().toFixed(0);
	},

	getTimePosted: function() {
        var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var now = new Date();
        var timePosted = '';
        var hours = this.time.getHours();
        var minutes = this.time.getMinutes();
        var period = 'am';
        if(hours > 11) {
            hours = hours - 12;
            period = 'pm';
        }
        if(hours == 0) {
            hours = 12;
        }
        if(minutes < 10) {
            minutes = '0'+minutes;
        }

        // If today, put in 2:30 pm format
        if(
            now.getFullYear() == this.time.getFullYear() &&
            now.getMonth() == this.time.getMonth() &&
            now.getDate() == this.time.getDate()
        ) {
            timePosted = hours+':'+minutes+' '+period;
        }
        else {
            timeDifference = (((new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime() - new Date(this.time.getFullYear(), this.time.getMonth(), this.time.getDate()).getTime()) / 1000),
            dayDifference = Math.floor(timeDifference / 86400);    

            if(dayDifference == 1) {
                timePosted = 'Yesterday';
            }
            else if(dayDifference < 7) {
                timePosted = dayNames[this.time.getDay()];
            }
            else if(dayDifference < 14) {
                timePosted = 'Last '+dayNames[this.time.getDay()];
            }
            else if(dayDifference >= 14) {
                timePosted = monthNames[this.time.getMonth()]+' '+this.time.getDate()+', '+this.time.getFullYear();
            }
        }

        return timePosted;
	},

});

// Static methods
Time.precision = 'milliseconds';
Time.now = Time.prototype.now;
Time.nowInMilliseconds = Time.prototype.nowInSeconds;
Time.nowInMilliseconds = Time.prototype.nowInMilliseconds;
Time.nowInMicroseconds = Time.prototype.nowInMicroseconds;