// Class
class RegularExpression extends RegExp {

	is(value) {
		return value instanceof RegExp;
	}

	equal(x, y) {
	    return (x instanceof RegExp) && (y instanceof RegExp) && 
	           (x.source === y.source) && (x.global === y.global) && 
	           (x.ignoreCase === y.ignoreCase) && (x.multiline === y.multiline);
	}

	escape(string) {
		if(Number.is(string)) {
			string = ''+string;
		}

		return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

}

// Global
global.RegularExpression = RegularExpression;

// Export
export default RegularExpression;