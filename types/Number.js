Number.prototype.toInteger = function() {
	return parseInt(this, 10);
}

Number.random = function(minimum, maximum, precision) {
	minimum = minimum === undefined ? 0 : minimum;
	maximum = maximum === undefined ? 9007199254740992 : maximum;
	precision = precision === undefined ? 0 : precision;

	// toFixed digits argument must be between 0 and 20
	if(precision > 20) {
		precision = 20;
	}
	if(precision < 0) {
		precision = 0;
	}

	var random = Math.random() * (maximum - minimum) + minimum;

    return Number(random.toFixed(precision));
}

Number.is = function(value) {
	return typeof(value) == 'number' || value instanceof Number;
}

Number.round = Math.round;