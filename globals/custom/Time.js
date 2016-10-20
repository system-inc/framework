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

	now() {
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
	}

	nowInSeconds() {
		return this.nowInMilliseconds() / 1000;
	}

	nowInMilliseconds() {
		var now = new Date().getTime();

		return now;
	}

	nowInMicroseconds() {
		var now = new Date().getTime() * 1000;

		return now;
	}

	nowInNanoseconds() {
		var now = new Date().getTime() * 1000000;

		return now;
	}

	getShortTime() {
		var shortTime = '';

		shortTime += this.getHour12Padded();
		shortTime += ':'+this.getMinutePadded();
		shortTime += ' '+this.getPeriod();

		return shortTime;
	}

	getLongTime() {
		var longTime = '';

		longTime += this.getHour12Padded();
		longTime += ':'+this.getMinutePadded();
		longTime += ':'+this.getSecondPadded();
		longTime += ' '+this.getPeriod();

		return longTime;
	}

	getPeriod() {
		var period = 'AM';

		var hours = this.dateObject.getHours();
        if(hours > 11) {
            period = 'PM';
        }

        return period;
	}

	getDayWithDate() {
		// Monday, January 1, 2014
		var dayWithDate = '';

		dayWithDate += this.getDayName()+', ';
		dayWithDate += this.getMonthName()+' ';
		dayWithDate += this.getDay()+', ';
		dayWithDate += this.getYear();

		return dayWithDate;
	}

	getDayWithDateAndTime(preposition = ' ') {
		if(preposition != ' ') {
			preposition = ' '+preposition+' ';
		}

		var dayWithDateAndTime = this.getDayWithDate();
		dayWithDateAndTime += preposition;
		dayWithDateAndTime += this.getHour12()+':';
		dayWithDateAndTime += this.getMinutePadded()+' ';
		dayWithDateAndTime += this.getPeriod();

		return dayWithDateAndTime;
	}

	getDayWithDateAndTimeWithSeconds(preposition = ' ') {
		if(preposition != ' ') {
			preposition = ' '+preposition+' ';
		}

		var dayWithDateAndTimeWithSeconds = this.getDayWithDate();
		dayWithDateAndTimeWithSeconds += preposition;
		dayWithDateAndTimeWithSeconds += this.getHour12()+':';
		dayWithDateAndTimeWithSeconds += this.getMinutePadded()+':';
		dayWithDateAndTimeWithSeconds += this.getSecondPadded()+' ';
		dayWithDateAndTimeWithSeconds += this.getPeriod();

		return dayWithDateAndTimeWithSeconds;
	}

	getYear() {
		return this.dateObject.getFullYear();
	}

	getMonth() {
		return this.dateObject.getMonth() + 1;
	}

	getMonthPadded() {
		return ('0'+(this.dateObject.getMonth() + 1)).slice(-2);
	}

	getMonthName() {
		return Time.monthNames[this.dateObject.getMonth()];
	}

	getDay() {
		return this.dateObject.getDate();
	}

	getDayPadded() {
		return ('0'+this.dateObject.getDate()).slice(-2);
	}

	getDayName() {
		return Time.dayNames[this.dateObject.getDay()];
	}

	getWeekDay() {
		return this.dateObject.getDay() + 1;
	}

	getHour12() {
		var hour = this.dateObject.getHours();

		if(hour > 11) {
            hour = hour - 12;
        }
        if(hour == 0) {
            hour = 12;
        }

        return hour;
	}

	getHour12Padded() {
        return ('0'+this.getHour12()).slice(-2);
	}

	getHour() {
		return this.dateObject.getHours();
	}

	getHourPadded() {
		return ('0'+(this.dateObject.getHours())).slice(-2);
	}

	getMinute() {
		return this.dateObject.getMinutes();
	}

	getMinutePadded() {
		return ('0'+(this.dateObject.getMinutes())).slice(-2);
	}

	getSecond() {
		return this.dateObject.getSeconds();
	}

	getSecondPadded() {
		return ('0'+(this.dateObject.getSeconds())).slice(-2);
	}

	getMillisecond() {
		return this.dateObject.getMilliseconds();
	}

	getMillisecondPadded() {
		return ('00'+(this.dateObject.getMilliseconds())).slice(-3);
	}

	getDateTime() {
		var dateTime = this.getYear();
		dateTime += '-'+this.getMonthPadded();
		dateTime += '-'+this.getDayPadded();
		dateTime += ' '+this.getHourPadded();
		dateTime += ':'+this.getMinutePadded();
		dateTime += ':'+this.getSecondPadded();

		return dateTime;
	}

	getDateTimeWithMilliseconds() {
		var dateTime = this.getDateTime();
		dateTime += ':'+this.getMillisecondPadded();

		return dateTime;
	}

	getDateTimeWithHour12PaddedAndPeriod() {
		var dateTime = this.getYear();
		dateTime += '-'+this.getMonthPadded();
		dateTime += '-'+this.getDayPadded();
		dateTime += ' '+this.getHour12Padded();
		dateTime += ':'+this.getMinutePadded();
		dateTime += ':'+this.getSecondPadded();
		dateTime += ' '+this.getPeriod();

		return dateTime;
	}

	// The number of seconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970
	getUnixTime() {
		return this.nowInSeconds().toFixed(0);
	}

	// The number of milliseconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970
	getUnixTimeInMilliseconds() {
		return this.nowInMilliseconds().toFixed(0);
	}

	getTimePosted() {
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
