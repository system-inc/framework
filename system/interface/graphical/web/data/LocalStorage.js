// Dependencies
import { Datastore } from '@framework/system/datastore/Datastore.js';

// Class
class LocalStorage extends Datastore {

	rootPath = null;

	constructor(rootPath) {
		super();

		if(rootPath) {
			this.rootPath = rootPath;
		}

		// We do not use the data object, we rely entirely on local storage
		// TODO: At some point in the future we can use this data object as a caching layer in front of local storage
		this.data = null;

		// Broadcast storage events
		window.addEventListener('storage', function(event) {
			var newValue = event.newValue;
			if(Json.is(newValue)) {
				newValue = Json.decode(newValue);
			}

			var oldValue = event.oldValue;
			if(Json.is(oldValue)) {
				oldValue = Json.decode(oldValue);
			}

			this.emit('localStorage.change', {
				key: event.key,
				newValue: newValue,
				oldValue: oldValue,
				storageArea: event.storageArea,
				url: event.ul,
			});
		}.bind(this));
	}

	get(path) {
		//app.log('LocalStorage.prototype.get path', path);

		if(this.rootPath && path !== undefined) {
			path = this.rootPath+'.'+path;
		}
		else if(this.rootPath) {
			path = this.rootPath;	
		}
		//app.log('path', path);

		var value = LocalStorage.getValueByPath(path);
		//app.log('path', path, 'value', value);
		
		return value;
	}

	set(path, value) {
		if(this.rootPath && path !== undefined) {
			path = this.rootPath+'.'+path;
		}
		else if(this.rootPath) {
			path = this.rootPath;	
		}

		LocalStorage.setValueByPath(path, value);

		return this;
	}

	delete(path) {
		if(this.rootPath && path !== undefined) {
			path = this.rootPath+'.'+path;
		}
		else if(this.rootPath) {
			path = this.rootPath;	
		}

		LocalStorage.deleteValueByPath(path);

		return this;
	}

	getData() {
		return LocalStorage.get(this.rootPath);
	}

	setData(data) {
		//app.log('LocalStorage.prototype.setData', data);

		// If there is a root path
		if(this.rootPath) {
			//app.log('this.rootPath', this.rootPath);
			// Delete the current value at the root path
			LocalStorage.delete(this.rootPath);

			// Set the new data on the root path
			LocalStorage.set(this.rootPath, data);
		}
		// If there isn't a root path
		else {
			// Empty the entire local storage
			LocalStorage.empty();

			// Loop through each key in data and set it
			if(data && Object.is(data)) {
				data.each(function(key, value) {
					this.set(key, value);
				}.bind(this));
			}
		}

		return data;
	}

	empty() {
		localStorage.clear();

		return {};
	}

	merge(data) {
		//app.log('LocalStorage.prototype.merge', data);

		return LocalStorage.merge(data, this.rootPath);
	}

	integrate(data) {
		return LocalStorage.integrate(data, this.rootPath);
	}

	static get(key) {
		//app.log('LocalStorage.get', arguments);

		var value = null;

		// If a key is provided
		if(key) {
			value = LocalStorage.reformGetValue(localStorage.getItem(key));
		}
		// If there is no key, get everything
		else {
			// Check to see if there is anything in local storage
			var localStorageLength = localStorage.length;

			// If there is something, we will setup an object to return
			if(localStorageLength) {
				value = {};
			}

			for(var i = 0; i < localStorageLength; ++i) {
				var key = localStorage.key(i);
				value[key] = LocalStorage.reformGetValue(localStorage.getItem(key));
			}
		}	

		return value;
	}

	static getValueByPath(path) {
		//app.log('LocalStorage.getValueByPath', arguments);

		var value = null;

		var keys = path.split('.');
		var firstKey = keys.first();
		//app.log('firstKey', firstKey);

		var object = LocalStorage.get(firstKey);
		//app.log('object', object);

		// If the path is a single key
		if(keys.length == 1) {
			// Set the value using the only key
			value = LocalStorage.get(firstKey);
		}
		// If there is more than one key in the path
		else {
			// Get the value at the first key in the path
			var currentValue = LocalStorage.get(firstKey);

			// If the current value is not an object, it needs to be an object as we have nested keys
			if(!Object.is(currentValue)) {
				currentValue = {};
			}

			// Remove the first key from the keys array
			keys.shift();

			// Set the value by path on our object
			value = currentValue.getValueByPath(keys.join('.'));
		}

	    return value;
	}

	static reformGetValue(getValue) {
		//app.log('LocalStorage.reformGetValue', arguments);

		// Handle Primitive strings
		if(getValue == 'true') {
			getValue = true;
		}
		else if(getValue == 'false') {
			getValue = false;
		}
		else if(getValue == 'null') {
			getValue = null;
		}
		else if(getValue == 'undefined') {
			getValue = undefined;
		}
		// Handle JSON objects
		else if(Json.is(getValue)) {
			getValue = Json.decode(getValue);
		}

		return getValue;
	}

	static set(key, value) {
		//app.log('LocalStorage.set', arguments);

		//app.log('LocalStorage.set', key, value)
		return localStorage.setItem(key, LocalStorage.reformSetValue(value));
	}

	static reformSetValue(setValue) {
		//app.log('LocalStorage.reformSetValue', arguments);

		// Encode non-primitives
		if(!Primitive.is(setValue)) {
			setValue = Json.encode(setValue);
		}

		return setValue;
	}

	static setValueByPath(path, value) {
		//app.log('LocalStorage.setValueByPath', arguments);

		var keys = path.split('.');
		var firstKey = keys.first();

		// If the path is a single key
		if(keys.length == 1) {
			// Set the value using the only key
			LocalStorage.set(firstKey, value);
		}
		// If there is more than one key in the path
		else {
			// Get the value at the first key in the path
			var currentValue = LocalStorage.get(firstKey);

			// If the current value is not an object, it needs to be an object as we have nested keys
			if(!Object.is(currentValue)) {
				currentValue = {};
			}

			// Remove the first key from the keys array
			keys.shift();

			// Set the value by path on our object
			currentValue.setValueByPath(keys.join('.'), value);

			// Write the object back to local storage
			LocalStorage.set(firstKey, currentValue);
		}

	    return value;
	}

	static delete(key) {
		//app.log('LocalStorage.delete', arguments);

		return localStorage.removeItem(key);
	}

	static deleteValueByPath(path) {
		//app.log('LocalStorage.deleteValueByPath', arguments);

		var keys = path.split('.');
		var firstKey = keys.first();

		// If the path is a single key
		if(keys.length == 1) {
			// Delete the value using the only key
			LocalStorage.delete(firstKey);
		}
		// If there is more than one key in the path
		else {
			// Get the value at the first key in the path
			var currentValue = LocalStorage.get(firstKey);

			// If the current value is an object
			if(Object.is(currentValue)) {
				// Remove the first key from the keys array
				keys.shift();

				// Delete the value by path on our object
				currentValue.deleteValueByPath(keys.join('.'));

				// Write the object back to local storage
				LocalStorage.set(firstKey, currentValue);
			}
		}

	    return true;
	}

	static empty() {
		app.log('LocalStorage.empty', arguments);

		return localStorage.clear();
	}

	static merge(data, key) {
		//app.log('LocalStorage.merge', data, key);

		// Read the current value of all of local storage or the key if it is set
		var currentValue = LocalStorage.get(key);
		//app.log('currentValue', currentValue);

		// Make sure we are working with an object
		if(!Object.is(currentValue)) {
			currentValue = {};
		}

		// Merge the data on top of the current value
		currentValue.merge(data);

		// If a key is provided
		if(key) {
			// Write the value out to the key
			LocalStorage.set(key, currentValue);
		}
		// If no key is provided
		else {
			// Loop through the current values root keys and set them in local storage
			currentValue.each(function(rootPath, value) {
				LocalStorage.set(rootPath, value);
			});
		}

		return currentValue;
	}

	static integrate(data, key) {
		//app.log('LocalStorage.integrate', arguments);

		// Read the current value of all of local storage or the key if it is set
		var currentValue = LocalStorage.get(key);

		// Make sure we are working with an object
		if(!Object.is(currentValue)) {
			currentValue = {};
		}

		// Integrate the data on top of the current value
		currentValue.integrate(data);

		// If a key is provided
		if(key) {
			// Write the value out to the key
			LocalStorage.set(key, currentValue);
		}
		// If no key is provided
		else {
			// Loop through the current values root keys and set them in local storage
			currentValue.each(function(rootPath, value) {
				LocalStorage.set(rootPath, value);
			});
		}

		return currentValue;
	}

}

// Export
export { LocalStorage };
