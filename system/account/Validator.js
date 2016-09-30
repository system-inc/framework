class Validator {

	static isMalicious(string) {
		var reasons = [];

		// Regex for typical SQL Injection attack
		if(string.test(/\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/ix)) {
			reasons.append('sqlInjection');
		}

		// Regex for detecting SQL Injection with the UNION keyword
		if(string.test(/((\%27)|(\'))union/ix)) {
			reasons.append('sqlInjectionUnion');
		}

		// Regex for detecting SQL Injection attacks on a MS SQL Server
		if(string.test(/exec(\s|\+)+(s|x)p\w+/ix)) {
			reasons.append('msSqlInjection');
		}

		// Regex for simple CSS attack
		if(string.test(/((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/ix)) {
			reasons.append('cssXss');
		}

		// Regex for "<img src" CSS attack
		if(string.test(/((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/I)) {
			reasons.append('imgXss');
		}

		if(reasons.length) {
			return reasons;
		}
		else {
			return false;
		}
	}

	static isValidUsername(string) {
		var errors = [];

		if(!string) {
			errors.append('Username cannot be empty.');
		}

		if(string.length < 3) {
			errors.append('Username must be at least three characters.');
		}

		if(string.length > 32) {
			errors.append('Username must be less than 32 characters.');
		}

		if(!string.test(/^([a-z0-9]+[_]?[a-z0-9]+)$/)) {
			errors.append('Username must be alphanumberic and cannot start, stop, or have more than one underscore.');
		}

		if(!string.test(/[a-z]/)) {
			errors.append('Username must contain at least one letter.');
		}

		if(errors.length) {
			return errors;
		}
		else {
			return true;
		}
	}

	static isValidPassword(string) {
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
			errors.append('Password cannot be empty.');
		}

		if(commonPasswords.contains(string)) {
			errors.append('Password too common.');
		}

		if(string.length < 8) {
			errors.append('Password must be at least eight characters.');
		}

		if(!string.test(/[0-9]/)) {
			errors.append('Password must contain at least one number.');
		}

		if(!string.test(/[a-z]/)) {
			errors.append('Password must contain at least one letter.');
		}

		if(errors.length) {
			return errors;
		}
		else {
			return true;
		}
	}

}

// Export
export default Validator;
