// Class
class Boolean extends global.Boolean {

	static is(value) {
		var is = false;

		if(value === true || value === false) {
			is = true;
		}

		return is;
	}

}

// Global
global.Boolean = Boolean;

// Export
export default Boolean;