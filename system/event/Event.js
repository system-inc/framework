// Class
class Event {

	emitter = null; // A reference to the object that emitted the event (also known as "target")
	currentEmitter = null; // A reference to the object that is currently emitting the event (also known as "currentTarget"); this will be different than this.emitter during the capturing and bubbling phases

	identifier = null;
	data = null; // An optional object of data passed to an event method when the current executing handler is bound
	
	stopped = null; // Whether or not event.stop() has been called

	defaultCanBePrevented = true; // Whether or not event.defaultPrevented can be true (also known as "cancleable"), defaults to true
	defaultPrevented = null; // Bound event listener functions can check if defaultPrevented is true or false, and do some conditional action
		
	previousReturnValue = null;
	
	time = null;

	constructor(emitter, identifier, data, options) {
		// Set the default options
		options = {
			defaultCanBePrevented: true,
		}.merge(options);

		this.emitter = emitter;
		this.currentEmitter = this.emitter;

		this.identifier = identifier;
		if(data) {
			this.data = data;	
		}		

		if(!options.defaultCanBePrevented) {
			this.defaultCanBePrevented = false;
		}

		this.time = new Time();
	}

	// Prevents other listeners of the same event from being called, and the event will not propagate (also known as stopImmediatePropagation)
	stop() {
		//this.preventDefault(); // Also prevent default?
		this.stopped = true;
	}

	// Bound event listener functions can check if event.defaultPrevented is true or false, and do some conditional action
	// This is useful is you want to still have an event propagate but not 
	// Calling prevent default will mark defaultPrevented as true
	// This will not stop propagation of the event
	preventDefault() {
		if(this.defaultCanBePrevented) {
			this.defaultPrevented = true;	
		}
	}

	static is = function(value) {
		return Class.isInstance(value, Event);
	}

}

// Export
export { Event };
