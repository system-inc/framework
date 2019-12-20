// Dependencies
import Cookie from 'framework/system/server/protocols/http/messages/headers/Cookie.js';

// Class
class Cookies {

	cookies = [];

	constructor(string) {
		if(string) {
			this.parse(string);	
		}
	}

	parse(string) {
		string.split(';').each(function(index, cookie) {
			if(!cookie.empty()) {
				var parts = cookie.split('=');
	        	this.cookies.append(new Cookie(parts.shift().trim(), unescape(parts.join('='))));
			}
		}.bind(this));
	}

	get(key, caseSensitive) {
		caseSensitive = caseSensitive === true ? true : false;
		var cookie = null;

		if(caseSensitive) {
			for(var i = 0; i < this.cookies.length; i++) {
				if(this.cookies[i].key == key) {
					cookie = this.cookies[i].value;
					break;
				}
			}	
		}
		else {
			for(var i = 0; i < this.cookies.length; i++) {
				if(this.cookies[i].key.toLowerCase() == key.toLowerCase()) {
					cookie = this.cookies[i].value;
					break;
				}
			}
		}

		return cookie;
	}

	getCookie(key, caseSensitive) {
		caseSensitive = caseSensitive === true ? true : false;
		var cookie = null;

		if(caseSensitive) {
			for(var i = 0; i < this.cookies.length; i++) {
				if(this.cookies[i].key == key) {
					cookie = this.cookies[i].value;
					break;
				}
			}	
		}
		else {
			for(var i = 0; i < this.cookies.length; i++) {
				if(this.cookies[i].key.toLowerCase() == key.toLowerCase()) {
					cookie = this.cookies[i];
					break;
				}
			}
		}

		return cookie;
	}

	add(cookie) {
		this.cookies.append(cookie);
	}

	create(key, value) {
		var cookie = new Cookie(key, value);

		this.cookies.append(cookie);

		return cookie;
	}

	set(key, value, caseSensitive) {
		return this.update(key, value, caseSensitive);
	}

	update(key, value, caseSensitive) {
		caseSensitive = caseSensitive === true ? true : false;
		var cookie = this.getCookie(key, false);

		if(cookie != null) {
			cookie.value = value;
		}
		else {
			cookie = this.create(key, value);
		}

		return cookie;
	}

	delete() {

	}

	length() {
		return this.cookies.length;
	}

	toHeadersArray() {
		var headersArray = [];

		this.cookies.each(function(index, cookie) {
			headersArray.append(cookie.toHeader());
		});

		return headersArray;
	}
	
}

// Export
export default Cookies;
