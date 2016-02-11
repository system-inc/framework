LocalStorage = {};

LocalStorage.get = function(keyName) {
	var value = localStorage.getItem(keyName);

	if(Json.is(value)) {
		value = Json.decode(value);
	}

	return value;
}

LocalStorage.set = function(keyName, value) {
	if(!Primitive.is(value)) {
		value = Json.encode(value);
	}

	//console.log('LocalStorage.set', keyName, value)

	return localStorage.setItem(keyName, value);
}

LocalStorage.delete = LocalStorage.remove = function(keyName) {
	return localStorage.removeItem(keyName);
}

LocalStorage.clear = function() {
	return localStorage.clear();
}