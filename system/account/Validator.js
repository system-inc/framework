Validator = Class.extend({

	construct: function() {
	},

});

Validator.isMalicious = function(string) {
	var reasons = [];

	// Regex for typical SQL Injection attack
	if(string.test(/\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/ix)) {
		reasons.push('sqlInjection');
	}

	// Regex for detecting SQL Injection with the UNION keyword
	if(string.test(/((\%27)|(\'))union/ix)) {
		reasons.push('sqlInjectionUnion');
	}

	// Regex for detecting SQL Injection attacks on a MS SQL Server
	if(string.test(/exec(\s|\+)+(s|x)p\w+/ix)) {
		reasons.push('msSqlInjection');
	}

	// Regex for simple CSS attack
	if(string.test(/((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/ix)) {
		reasons.push('cssXss');
	}

	// Regex for "<img src" CSS attack
	if(string.test(/((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/I)) {
		reasons.push('imgXss');
	}

	if(reasons.length) {
		return reasons;
	}
	else {
		return false;
	}
}

Validator.isValidUsername = function(string) {
	var errors = [];

	if(!string) {
		errors.push('Username cannot be empty.');
	}

	if(string.length < 3) {
		errors.push('Username must be at least three characters.');
	}

	if(string.length > 32) {
		errors.push('Username must be less than 32 characters.');
	}

	if(!string.test(/^([a-z0-9]+[_]?[a-z0-9]+)$/)) {
		errors.push('Username must be alphanumberic and cannot start, stop, or have more than one underscore.');
	}

	if(!string.test(/[a-z]/)) {
		errors.push('Username must contain at least one letter.');
	}

	if(errors.length) {
		return errors;
	}
	else {
		return true;
	}
}

Validator.isValidPassword = function(string) {
	var errors = [];

	var commonPasswords = [
		'123456'
		'password'
		'12345'
		'12345678'
		'qwerty'
		'1234567890'
		'1234'
		'baseball'
		'dragon'
		'football'
		'1234567'
		'monkey'
		'letmein'
		'abc123'
		'111111'
		'mustang'
		'access'
		'shadow'
		'master'
		'michael'
		'superman'
		'696969'
		'123123'
		'batman'
		'trustno1'
	];

	if(!string) {
		errors.push('Password cannot be empty.');
	}

	if(commonPasswords.contains(string)) {
		errors.push('Password too common.');
	}

	if(string.length < 8) {
		errors.push('Password must be at least eight characters.');
	}

	if(!string.test(/[0-9]/)) {
		errors.push('Password must contain at least one number.');
	}

	if(!string.test(/[a-z]/)) {
		errors.push('Password must contain at least one letter.');
	}

	if(errors.length) {
		return errors;
	}
	else {
		return true;
	}
}