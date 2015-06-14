Number.is = function(value) {
	return typeof(value) == 'number' || value instanceof Number;
}

Number.isInteger = function(value) {
	return /^\+?-?(0|[1-9]\d*)$/.test(value);
}

Number.prototype.isInteger = function() {
	return Number.isInteger(this);
}

Number.toInteger = function(value) {
	if(!value) {
		return 0;
	}

	return parseInt(value, 10);
}

Number.prototype.toInteger = function() {
	return Number.toInteger(this);
}

Number.round = function(number, precision) {
	precision = (precision === undefined ? 0 : precision);

	var number = number.toFixed(precision);

	// Make 0 precision numbers integers
	if(precision == 0) {
		number = Number.toInteger(number);
	}

	return number;
}

Number.addCommas = function(number) {
	if(number === undefined) {
		return '';
	}

	var parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}

Number.toMoney = function(number, precision) {
	precision = (precision === undefined ?  2 : precision);

	var formatted;
	if(number < 0) {
		formatted = '-$'+Math.abs(Number.addCommas(number.toFixed(precision)));
	}
	else {
		formatted = '$'+Number.addCommas(number.toFixed(precision));
	}

	return formatted;
};

// Minimum and maximum are both inclusive
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

// Minimum and maximum are both inclusive
Number.cryptographicRandom = function*(minimum, maximum, precision) {
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

	var cryptographicRandom = yield Cryptography.random();

	var random = cryptographicRandom * (maximum - minimum) + minimum;

    return Number(random.toFixed(precision));
}.toPromise();