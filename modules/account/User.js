User = Class.extend({

	model: null,

	construct: function() {
	},

});

// Static methods

User.signUp = function(username, email, password, confirmPassword) {
	// Throttle create requests

	// Verify the username is valid

	// Verify the email address is valid

	// Make sure the passwords match

	// Verify the password is valid

	// Create the user model
	var userModel = new User();
	userModel.setUsername(username);

	var passwordHash = '';
	var passwordSalt = '';
	var password = passwordSalt + passwordHash;
	userModel.setPassword(password);

	// Save the user
	userModel.save();

	// Send the verification email
	
}

User.signIn = function(userIdentifier, password) {

}