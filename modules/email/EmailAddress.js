EmailAddress = Class.extend({
});

// Static methods
EmailAddress.is = function(string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(string);
}