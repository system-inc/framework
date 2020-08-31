// Dependencies
import { Header } from '@framework/system/server/protocols/http/messages/headers/Header.js';
import { Cookies } from '@framework/system/server/protocols/http/messages/headers/Cookies.js';
import { Cookie } from '@framework/system/server/protocols/http/messages/headers/Cookie.js';

// Class
class Headers {

	headers = [];

	constructor(headersString = null) {
		if(headersString !== null) {
			// Split the string into lines
			let headersLines = headersString.split("\n");

			// Loop through each line
			headersLines.each(function(index, headerLine) {
				// Split each line into key: value
				let splitHeaderLine = headerLine.split(': ');

				let key = splitHeaderLine[0];
				let value = splitHeaderLine[1];

				// Create the header
				if(key) {
					this.create(key, value);
				}
			}.bind(this));
		}
	}

	get(key, caseSensitive) {
		caseSensitive = caseSensitive === true ? true : false; // Case insensitive by default
		var header = null;

		if(caseSensitive) {
			for(var i = 0; i < this.headers.length; i++) {
				if(this.headers[i].key == key) {
					header = this.headers[i].value;
					break;
				}
			}	
		}
		else {
			for(var i = 0; i < this.headers.length; i++) {
				if(this.headers[i].key.toLowerCase() == key.toLowerCase()) {
					header = this.headers[i].value;
					break;
				}
			}
		}

		return header;
	}

	getHeader(key, caseSensitive) {
		caseSensitive = caseSensitive === true ? true : false;
		var header = null;

		if(caseSensitive) {
			for(var i = 0; i < this.headers.length; i++) {
				if(this.headers[i].key == key) {
					header = this.headers[i].value;
					break;
				}
			}	
		}
		else {
			for(var i = 0; i < this.headers.length; i++) {
				if(this.headers[i].key.toLowerCase() == key.toLowerCase()) {
					header = this.headers[i];
					break;
				}
			}
		}

		return header;
	}

	create(key, value) {
		var header = new Header(key, value);

		this.headers.append(header);

		return header;
	}

	update(key, value, caseSensitive) {
		caseSensitive = caseSensitive === true ? true : false;
		var header = this.getHeader(key, false);

		if(header != null) {
			header.value = value;
		}
		else {
			header = this.create(key, value);
		}

		return header;
	}

	set(key, value, caseSensitive) {
		return this.update(key, value, caseSensitive);
	}

	delete(key, caseSensitive) {
		caseSensitive = caseSensitive === true ? true : false;

		var indexToDelete = null;
		this.headers.each(function (index, header) {
			if(caseSensitive) {
				if(key == header.key) {
					indexToDelete = index;
					return false; // break
				}	
			}
			else {
				if(key.lowercase() == header.key.lowercase()) {
					indexToDelete = index;
					return false; // break
				}	
			}
		});

		if(indexToDelete !== null) {
			this.headers.delete(indexToDelete);
		}

		return this.headers;
	}

	getCookies() {
		var cookies = new Cookies();

		this.headers.each(function(index, header) {
			if(header.key.lowercase() == 'set-cookie' || header.key.lowercase() == 'cookie') {
				cookies.add(Cookie.fromHeaderString(header.value));
			}
		});

		return cookies;
	}

	addCookies(cookies) {
		cookies.cookies.each(function(index, cookie) {
			this.create('Set-Cookie', cookie.toHeaderString());
		}.bind(this));
	}

	removeNullHeaders() {
		var headers = [];

		this.headers.each(function(index, header) {
			if(header.value !== null) {
				headers.append(header);
			}
		});

		this.headers = headers;
	}

	length() {
		return this.headers.length;
	}

	toArray() {
		var array = [];

		this.headers.each(function(index, header) {
			array.append([header.key, header.value]);
		}.bind(this));

		return array;
	}

	toObject() {
		var object = {};

		this.headers.each(function(index, header) {
			object[header.key] = header.value;
		}.bind(this));

		return object;
	}

	static fromNodeHeaders(nodeHeaders) {
		//app.highlight(nodeHeaders); app.exit();

		var headers = new Headers();

		if(nodeHeaders) {
			nodeHeaders.each(function(headerName, headerValue) {
				// Handle multiple headers of the same key (e.g., "Set-Cookie")
				if(Array.is(headerValue)) {
					headerValue.each(function(headerValueIndex, headerValueValue) {
						headers.create(headerName, headerValueValue);
					});
				}
				else {
					headers.create(headerName, headerValue);
				}
			});	
		}
		
		return headers;
	}

	static nodeRawHeadersToString(rawHeaders) {
		var rawHeadersString = '';

		for(var index = 0; index < rawHeaders.length; index++) {
			// Node is silly and uses even and odd numbers to specify key value pairs
			// Zeroth
		    if(index == 0) {
		    	rawHeadersString += rawHeaders[index]+': ';
		    }
		    // Odd
		    else if(index % 2) {
		    	rawHeadersString += rawHeaders[index];
		    }
		    // Even
		    else {
		    	rawHeadersString += "\n"+rawHeaders[index]+': ';
		    }
		}

		return rawHeadersString;
	}
	
}

// Export
export { Headers };
