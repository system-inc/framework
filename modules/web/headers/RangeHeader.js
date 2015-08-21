RangeHeader = Class.extend({

	unit: null, // Usually "bytes"
	ranges: [], // Range requests can have multiple ranges
	input: null, // Store the original input for debugging

	construct: function(input) {
		this.input = input;

		var matches = input.match(/^([^\s]+)=((?:(?:\d+-\d+|-\d+|\d+-),?)+)$/);

		this.unit = matches[1];

		matches[2].split(',').each(function(index, range) {
			this.ranges.push(this.parseRange(range));
		}.bind(this));
	},

	parseRange: function(input) {
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
	},

	getReadStreamRange: function(size) {
		var range = this.ranges[0];
		Console.out('range', range);

		var rangeToReturn = {
			start: null,
			end: null,
		};

		// Start is set
		if(range.start !== undefined) {
			rangeToReturn.start = range.start;
		}

		// End is set
		if(range.end !== undefined) {
			rangeToReturn.end = range.end;
		}

		// End is set and start is not set
		if(range.end !== undefined && range.start == undefined) {
			//Console.out('range.start', range.start);
			//Console.out('range.end', range.end);
			//Console.out('size', size);
			rangeToReturn.start = size - range.end;
			rangeToReturn.end = size - 1;
			//Console.out('rangeToReturn', rangeToReturn);
			//Node.exit('end without start');
		}

		return rangeToReturn;
	},

	toString: function() {
		return this.unit+'='+this.ranges.join(',');
	},

});