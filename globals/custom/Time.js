// Class
class Time {

	dateObject = null;
	precision = 'milliseconds';

	constructor(stringOrDateObject = new Date()) {
		if(String.is(stringOrDateObject)) {
			this.dateObject = new Date(stringOrDateObject);
		}
		else {
			this.dateObject = stringOrDateObject;
		}
	}

	setPrecision(precision) {
		this.precision = precision;
	}

	get now() {
		var now = null;

		if(this.precision == 'milliseconds') {
			return this.nowInMilliseconds;
		}
		else if(this.precision == 'microseconds') {
			return this.nowInMicroseconds;
		}
		else if(this.precision == 'nanoseconds') {
			return this.nowInNanoseconds;
		}
		else if(this.precision == 'seconds') {
			return this.nowInSeconds;
		}

		return now;
	}

	get nowInSeconds() {
		return this.nowInMilliseconds / 1000;
	}

	get nowInMilliseconds() {
		var now = new Date().getTime();

		return now;
	}

	get nowInMicroseconds() {
		var now = new Date().getTime() * 1000;

		return now;
	}

	get nowInNanoseconds() {
		var now = new Date().getTime() * 1000000;

		return now;
	}

	get shortTime() {
		var shortTime = '';

		shortTime += this.hour12Padded;
		shortTime += ':'+this.minutePadded;
		shortTime += ' '+this.period;

		return shortTime;
	}

	get longTime() {
		var longTime = '';

		longTime += this.hour12Padded;
		longTime += ':'+this.minutePadded;
		longTime += ':'+this.secondPadded;
		longTime += ' '+this.period;

		return longTime;
	}

	get period() {
		var period = 'AM';

		var hours = this.dateObject.getHours();
        if(hours > 11) {
            period = 'PM';
        }

        return period;
	}

	get dayWithDate() {
		// Monday, January 1, 2014
		var dayWithDate = '';

		dayWithDate += this.dayName+', ';
		dayWithDate += this.monthName+' ';
		dayWithDate += this.day+', ';
		dayWithDate += this.year;

		return dayWithDate;
	}

	getDayWithDateAndTime(preposition = ' ') {
		if(preposition != ' ') {
			preposition = ' '+preposition+' ';
		}

		var dayWithDateAndTime = this.dayWithDate;
		dayWithDateAndTime += preposition;
		dayWithDateAndTime += this.hour12+':';
		dayWithDateAndTime += this.minutePadded+' ';
		dayWithDateAndTime += this.period;

		return dayWithDateAndTime;
	}

	getDayWithDateAndTimeWithSeconds(preposition = ' ') {
		if(preposition != ' ') {
			preposition = ' '+preposition+' ';
		}

		var dayWithDateAndTimeWithSeconds = this.dayWithDate;
		dayWithDateAndTimeWithSeconds += preposition;
		dayWithDateAndTimeWithSeconds += this.hour12+':';
		dayWithDateAndTimeWithSeconds += this.minutePadded+':';
		dayWithDateAndTimeWithSeconds += this.secondPadded+' ';
		dayWithDateAndTimeWithSeconds += this.period;

		return dayWithDateAndTimeWithSeconds;
	}

	get year() {
		return this.dateObject.getFullYear();
	}

	get month() {
		return this.dateObject.getMonth() + 1;
	}

	get monthPadded() {
		return ('0'+(this.dateObject.getMonth() + 1)).slice(-2);
	}

	get monthName() {
		return Time.monthNames[this.dateObject.getMonth()];
	}

	get day() {
		return this.dateObject.getDate();
	}

	get dayPadded() {
		return ('0'+this.dateObject.getDate()).slice(-2);
	}

	get dayName() {
		return Time.dayNames[this.dateObject.getDay()];
	}

	get weekDay() {
		return this.dateObject.getDay() + 1;
	}

	get hour12() {
		var hour = this.dateObject.getHours();

		if(hour > 11) {
            hour = hour - 12;
        }
        if(hour == 0) {
            hour = 12;
        }

        return hour;
	}

	get hour12Padded() {
        return ('0'+this.hour12).slice(-2);
	}

	get hour() {
		return this.dateObject.getHours();
	}

	get hourPadded() {
		return ('0'+(this.dateObject.getHours())).slice(-2);
	}

	get minute() {
		return this.dateObject.getMinutes();
	}

	get minutePadded() {
		return ('0'+(this.dateObject.getMinutes())).slice(-2);
	}

	get second() {
		return this.dateObject.getSeconds();
	}

	get secondPadded() {
		return ('0'+(this.dateObject.getSeconds())).slice(-2);
	}

	get millisecond() {
		return this.dateObject.getMilliseconds();
	}

	get millisecondPadded() {
		return ('00'+(this.dateObject.getMilliseconds())).slice(-3);
	}

	get dateTime() {
		var dateTime = this.year;
		dateTime += '-'+this.monthPadded;
		dateTime += '-'+this.dayPadded;
		dateTime += ' '+this.hourPadded;
		dateTime += ':'+this.minutePadded;
		dateTime += ':'+this.secondPadded;

		return dateTime;
	}

	get dateTimeWithMilliseconds() {
		var dateTime = this.dateTime;
		dateTime += ':'+this.millisecondPadded;

		return dateTime;
	}

	get dateTimeWithHour12PaddedAndPeriod() {
		var dateTime = this.year;
		dateTime += '-'+this.monthPadded;
		dateTime += '-'+this.dayPadded;
		dateTime += ' '+this.hour12Padded;
		dateTime += ':'+this.minutePadded;
		dateTime += ':'+this.secondPadded;
		dateTime += ' '+this.period;

		return dateTime;
	}

	// The number of seconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970
	get unixTime() {
		return this.nowInSeconds.toFixed(0);
	}

	// The number of milliseconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970
	get unixTimeInMilliseconds() {
		return this.nowInMilliseconds.toFixed(0);
	}

	get timePosted() {
        var now = new Date();
        var timePosted = '';
        var hours = this.dateObject.getHours();
        var minutes = this.dateObject.getMinutes();
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
            now.getFullYear() == this.dateObject.getFullYear() &&
            now.getMonth() == this.dateObject.getMonth() &&
            now.getDate() == this.dateObject.getDate()
        ) {
            timePosted = hours+':'+minutes+' '+period;
        }
        else {
            timeDifference = (((new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime() - new Date(this.dateObject.getFullYear(), this.dateObject.getMonth(), this.dateObject.getDate()).getTime()) / 1000),
            dayDifference = Math.floor(timeDifference / 86400);

            if(dayDifference == 1) {
                timePosted = 'Yesterday';
            }
            else if(dayDifference < 7) {
                timePosted = Time.dayNames[this.dateObject.getDay()];
            }
            else if(dayDifference < 14) {
                timePosted = 'Last '+Time.dayNames[this.dateObject.getDay()];
            }
            else if(dayDifference >= 14) {
                timePosted = Time.monthNames[this.dateObject.getMonth()]+' '+this.dateObject.getDate()+', '+this.dateObject.getFullYear();
            }
        }

        return timePosted;
	}

	// TODO: Make this do awesome shit
	format(string) {
		var formattedString = '';

		if(string == "MM/DD") {
			formattedString = this.monthPadded + '/' + this.dayPadded;
		}

		return formattedString;
	}

	toString() {
		var string = '';

		if(this.dateObject && this.dateObject.toISOString) {
			string = this.dateObject.toISOString();
		}
		else if(this.dateObject) {
			string = this.dateObject.toString();
		}

		return string;
	}

	static precision = 'milliseconds';
	static dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	static monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	static now = Time.prototype.now;
	static nowInMilliseconds = Time.prototype.nowInSeconds;
	static nowInMilliseconds = Time.prototype.nowInMilliseconds;
	static nowInMicroseconds = Time.prototype.nowInMicroseconds;

	static constructFromDosDateTime(date, time) {
		var day = date & 0x1f; // 1-31
		var month = (date >> 5 & 0xf) - 1; // 1-12, 0-11
		var year = (date >> 9 & 0x7f) + 1980; // 0-128, 1980-2108

		var millisecond = 0;
		var second = (time & 0x1f) * 2; // 0-29, 0-58 (even numbers)
		var minute = time >> 5 & 0x3f; // 0-59
		var hour = time >> 11 & 0x1f; // 0-23

		return new Time(new Date(year, month, day, hour, minute, second, millisecond));
	}

}

// Global
global.Time = Time;
