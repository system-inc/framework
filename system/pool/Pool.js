// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class Pool extends EventEmitter {

	reusableClass = null;

	availableReusables = {};
	busyReusables = {};

	size = 0;
	minimumSize = 0;
	maximumSize = 10;

	waitingForAvailableReusableCount = 0;

	createReusablesAsNecessary = true;

	timeInMillisecondsToWaitToRetireAvailableReusables = null;

	// Pool must always be initialized
	initialize() {
		if(!this.reusableClass) {
			throw new Error('Pool must have a reusable class of type Reusable.');
		}

		if(!this.createReusablesAsNecessary) {
			//app.log('Creating '+this.minimumSize+' reusables...');

			for(var i = 0; i < this.minimumSize; i++) {
				this.createReusable();
			}
		}

		return this;
	}

	createReusable() {
		//console.log('Pool.createReusable()');

		// Increment the size
		this.size++;

		// Construct the new reusable
		var reusable = new this.reusableClass(this);
		//console.log('reusable', reusable);
		
		// Set the new reusable by unique identifier in the busy reusables object
		this.busyReusables[reusable.uniqueIdentifier] = reusable;

		return reusable;
	}

	getReusable() {
		//console.log('Pool.getReusable()');

		this.waitingForAvailableReusableCount++;

		return new Promise(function(resolve, reject) {
			// Check if we have any free reusables
			var availableReusableKeys = Object.keys(this.availableReusables);
			if(availableReusableKeys.length) {
				// If we have available reusables, take the first one
				resolve(this.takeAvailableReusable(this.availableReusables[availableReusableKeys[0]]));
			}
			// If we don't have any free reusables
			else {
				//app.log('Waiting for reusable...');

				// If we can start the process of creating a new reusable
				if(this.size < this.maximumSize) {
					//app.log(this.size, 'is less than', this.maximumSize, 'creating new reusable...');

					// Create a new reusable
					this.createReusable();
				}

				// Register to get the next available reusable
				this.once('pool.availableReusable', function(event) {
					//console.log('pool.availableReusable event', event);

					// We must stop the event otherwise others waiting for available reusables will receive the event
					event.stop();

					// Take the available reusable
					resolve(this.takeAvailableReusable(event.data));
				}.bind(this));
			}
		}.bind(this));
	}

	getReusableByUniqueIdentifier(uniqueIdentifier) {
		var reusable = null;

		if(this.availableReusables[uniqueIdentifier]) {
			reusable = this.availableReusables[uniqueIdentifier];
		}
		else if(this.busyReusables[uniqueIdentifier]) {
			reusable = this.busyReusables[uniqueIdentifier];
		}

		return reusable;
	}

	takeAvailableReusable(reusable) {
		//console.log('taking available reusable', reusable);

		// Remove the reusable from the available list
		delete this.availableReusables[reusable.uniqueIdentifier];

		// Mark the reusable as taken
		reusable.taken();

		// Add the reusable to the busy list
		this.busyReusables[reusable.uniqueIdentifier] = reusable;

		this.waitingForAvailableReusableCount--;
		
		return reusable;
	}

	releaseReusable(reusable) {
		//console.log('Pool.releaseReusable', reusable);

		// Remove the reusable from the busy list
		delete this.busyReusables[reusable.uniqueIdentifier];

		// Mark the usuable as available
		reusable.released();

		// Add the reusable to the available list
		this.availableReusables[reusable.uniqueIdentifier] = reusable;

		// Emit an event letting any listeners know we have a free reusable
		this.emit('pool.availableReusable', reusable);

		return reusable;
	}

	retireReusable(reusable) {
		// Remove the reusable from the the available reusables
		if(reusable.available) {
			delete this.availableReusables[reusable.uniqueIdentifier];
		}
		// Or remove the reusable from the busy reusables
		else {
			delete this.busyReusables[reusable.uniqueIdentifier];
		}

		// Don't do this, leave the reusable around in case the implementer wants to do something with it after it is retired
		//reusable = null;

		this.size--;

		// Create a new reusable if we are below the minimum size or if there is someone waiting for an available reusable
		if((this.size < this.minimumSize) || (this.waitingForAvailableReusableCount > 0)) {
			this.createReusable();
		}
	}

	shouldRetireReusable() {
		var shouldRetireReusable = true;

		// If retiring the reusable would make the pool less than the minimum size
		if((this.size - 1) < this.minimumSize) {
			shouldRetireReusable = false;
		}

		return shouldRetireReusable;
	}

	retireReusableByUniqueIdentifier(uniqueIdentifier) {
		this.retireReusable(this.getReusableByUniqueIdentifier(uniqueIdentifier));
	}
	
}

// Export
export default Pool;
