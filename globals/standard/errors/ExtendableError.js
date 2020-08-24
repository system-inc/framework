// Class
//class ExtendableError {
class ExtendableError extends Error {

	constructor(message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.stack = (new Error(message)).stack;
		this.stack.shift(1); // Get rid of the first item on the stack which is just about Error construction
	}

	static is(value) {
		return Class.isInstance(value, ExtendableError);
	}
	
}

//ExtendableError.prototype = Error.prototype;

// Export
export { ExtendableError };
