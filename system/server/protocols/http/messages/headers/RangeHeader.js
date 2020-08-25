// Dependencies

// Class
class RangeHeader {

	unit = null; // Usually 'bytes'
	ranges = []; // Range requests can have multiple ranges
	input = null; // Store the original input for debugging

	constructor(input) {
		this.input = input;

		var matches = input.match(/^([^\s]+)=((?:(?:\d+-\d+|-\d+|\d+-),?)+)$/);

		if(matches && matches[1]) {
			this.unit = matches[1];

			matches[2].split(',').each(function(index, range) {
				this.ranges.append(this.parseRange(range));
			}.bind(this));
		}
		// If we can't parse a range, send the entire resource
		else {
			this.unit = 'bytes';
			this.ranges.append('0-');
		}
	}

	parseRange(input) {
		var parsedRange = {
			start: null,
			end: null,
		};

		var matches;
		if(String.is(input) && (matches = input.match(/^(\d+-\d+|\d+-|-\d+|\*)$/))) {
			var values = matches[1].split('-').map(function(value) {
				return value === '*' || value === '' ? undefined : parseInt(value);
			});

			parsedRange.start = values[0];
			parsedRange.end = values[1];
		}

		return parsedRange;
	}

	getReadStreamRange(size) {
		var range = this.ranges[0];

		var rangeToReturn = {
			start: null,
			end: null,
		};

		// There is no range
		if(!range) {
			rangeToReturn.start = 0;
			rangeToReturn.end = size - 1;
		}
		else if(range.start !== undefined && range.end !== undefined) {
			rangeToReturn.start = range.start;
			rangeToReturn.end = range.end;
		}
		// End is set and start is not set
		else if(range.end !== undefined && range.start === undefined) {
			rangeToReturn.start = size - range.end;
			rangeToReturn.end = size - 1;
		}
		// Start is set and end is not set
		else if(range.start !== undefined && range.end === undefined) {
			rangeToReturn.start = range.start;
			rangeToReturn.end = size - 1;
		}
		// Start and end are not set
		else if(range.start === undefined && range.end === undefined) {
			rangeToReturn.start = 0;
			rangeToReturn.end = size - 1;
		}

		return rangeToReturn;
	}

	isPartial(size) {
		var isPartial = true;
		var readStreamRange = this.getReadStreamRange(size);

		// Check to see if we are actually reading the entire file
		if(readStreamRange.start == 0 && readStreamRange.end == (size - 1)) {
			isPartial = false;
		}

		return isPartial;
	}

	getContentLength(size) {
		var contentLength = null;
		var readStreamRange = this.getReadStreamRange(size);

		contentLength = readStreamRange.end - readStreamRange.start + 1;
		//app.log('contentLength', contentLength);

		return contentLength;
	}

	getContentRange(size) {
		var contentRange = this.unit+' ';
		var readStreamRange = this.getReadStreamRange(size);

		contentRange += readStreamRange.start+'-'+readStreamRange.end;

		contentRange += '/'+size;

		//app.log('contentRange', contentRange);

		return contentRange;
	}

	toString() {
		return this.unit+'='+this.ranges.join(',');
	}

}

// Exports
export { RangeHeader };
