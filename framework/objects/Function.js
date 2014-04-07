Function.prototype.isGenerator = function() {
	return /^function\s*\*/.test(this.toString());
}