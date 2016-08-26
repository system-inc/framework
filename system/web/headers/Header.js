// Class
class Header {

	key = null;
	value = null;

	constructor(key, value) {
		this.key = key;
		this.value = value;
	}

	toString() {
		return this.value;
	}
	
}

// Export
export default Header;
