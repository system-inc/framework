User = Class.extend({

	construct: function() {
	},

});

// Static methods

User.signUp = function(username, email, password, confirmPassword, staySignedIn) {
	// Throttle sign up requests
	Api.throttle('User.signUp');

	// Verify the username is valid
	if(!Validator.isValidUsername(username)) {
		throw new BadRequestError('Invalid username.');
	}

	// Verify the email is valid
	if(!Validator.isValidEmail(email)) {
		throw new BadRequestError('Invalid email.');
	}

	// Make sure the passwords match
	if(password != confirmPassword) {
		throw new BadRequestError('Passwords must match.');
	}

	// Verify the password is valid
	if(!Validator.isValidPassword(password)) {
		throw new BadRequestError('Invalid password.');
	}

	// Create the user model
	var userModel = new User();

	// Set the username
	userModel.setUsername(username);

	// Ensure passwords are stored with an algorithm specifically designed for password protection, such as bcrypt
	var passwordHash = bcrypt.hash(password, 10);
	
	// Set the password hash
	userModel.setPasswordHash(passwordHash);

	// Set the email
	userModel.setEmail(email);

	// Save the user
	userModel.save();

	// Send the verification email
	User.sendVerificationEmail(userModel);
	
	// Sign the user in
	var signIn = User.signIn(username, password, staySignedIn);

	return userModel;
}

User.signIn = function(userIdentifier, password, staySignedIn) {
	// Throttle sign in requests
	Api.throttle('User.signIn');

	// Use a safe method to find the user which escapes the SQL query preventing injection
	var user = User.findByUserIdentifier(userIdentifier);

	// Make sure the user exists
	if(!user) {
		// Do not show whether or not the user exists in the system, just show forbidden
		throw new ForbiddenError();
	}

	// Use bcrypt to compare hashes
	if(!bcrypt.compare(password, user.getPasswordHash())) {
		throw new ForbiddenError();
	}
	
	// Create a session token which does not contain any information other than a reference
	var userSession = new UserSession();

	// Set the token
	userSession.setToken(String.cryptographicRandom(128));

	// Save the session
	userSession.save();

	return userSession;
}