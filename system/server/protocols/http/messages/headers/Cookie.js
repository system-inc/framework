// Dependencies
import { Header } from '@framework/system/server/protocols/http/messages/headers/Header.js';

// Class
class Cookie {

	key = null;
	value = null;

	constructor(key, value) {
		this.key = key;

		// Decode JSON strings into objects
		if(Json.is(value)) {
			this.value = Json.decode(value);
		}
		else {
			this.value = value;	
		}
	}

	toHeader() {
		var header = new Header('Set-Cookie', this.toHeaderString());

		return header;
	}

	toHeaderString() {
		var value = this.value;

		// Encode non-primitives into JSON strings
		if(!Primitive.is(this.value)) {
			value = Json.encode(this.value);
		}

		var headerString = this.key+'='+value+';';

		return headerString;
	}

	static fromHeaderString(headerString) {
		var headerStringArray = headerString.split('=');
		var key = headerStringArray.first();

		// Remove the first item (the key)
		headerStringArray.delete(0);
		var value = headerStringArray.join('=').replaceLast(';', '');

		var cookie = new Cookie(key, value);

		return cookie;
	}
	
}

// Export
export { Cookie };
