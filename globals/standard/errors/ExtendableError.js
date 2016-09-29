// Class
class ExtendableError {

	constructor(message) {
		this.name = 'ExtendableError';
		this.message = message;
		this.stack = new Error().stack;
		this.stack.shift(1); // Get rid of the first item on the stack which is just about Error construction
	}
	
}

ExtendableError.prototype = Object.create(Error.prototype);

// Export
export default ExtendableError;
