// Class
class ExtendableError {

	constructor(message) {
		this.name = 'ExtendableError';
		this.message = message;
		this.stack = new Error().stack;
	}
	
}

ExtendableError.prototype = Object.create(Error.prototype);

// Export
export default ExtendableError;
