// Class
class Transpiler {

	static logCachedTranspiledSourceForPath(path) {
		var TranspilerCache = require('babel-register/lib/cache').get()

		TranspilerCache.each(function(key, value) {
			var keyObject = Json.decode(key.substring(0, key.length - 7));
			
			if(keyObject.filename == path) {
				console.log(value.code);
				return false; // break
			}
		});
	}

}

// Global
global.Transpiler = Transpiler;
