// Class
var LocalStorage = {};

LocalStorage.get = function(keyName) {
	var value = localStorage.getItem(keyName);
	
	// Handle Primitive strings
	if(value == 'true') {
		value = true;
	}
	else if(value == 'false') {
		value = false;
	}
	else if(value == 'null') {
		value = null;
	}
	else if(value == 'undefined') {
		value = undefined;
	}
	// Handle JSON objects
	else if(Json.is(value)) {
		value = Json.decode(value);
	}

	return value;
}

LocalStorage.set = function(keyName, value) {
	// Encode non-primitives
	if(!Primitive.is(value)) {
		value = Json.encode(value);
	}

	//Console.log('LocalStorage.set', keyName, value)

	return localStorage.setItem(keyName, value);
}

LocalStorage.delete = LocalStorage.remove = function(keyName) {
	return localStorage.removeItem(keyName);
}

LocalStorage.clear = function() {
	return localStorage.clear();
}

// Export
module.exports = LocalStorage;