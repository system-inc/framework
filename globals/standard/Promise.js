// Class
class Promise extends global.Promise {

	static is(value) {
		return value instanceof Promise;
	}

}

// Global
global.Promise = Promise;

// Export
export default Promise;