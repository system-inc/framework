var EventEmitter = Framework.require('system/events/EventEmitter.js');

// Class
var Pool = EventEmitter.extend({

	reusableClass: null,

	availableReusables: {},
	busyReusables: {},

	size: 0,
	minimumSize: 0,
	maximumSize: 10,

	waitingForAvailableReusableCount: 0,
	
	createReusablesAsNecessary: true,

	construct: function(reusableClass) {
		if(!this.reusableClass && !reusableClass) {
			throw new Error('Pool must be constructed with a specified subclass of type "Reusable".');
		}
		else if(reusableClass) {
			this.reusableClass = reusableClass;
		}

		if(!this.createReusablesAsNecessary) {
			Console.log('Creating '+this.maximumSize+' reusables...');

			for(var i = 0; i < this.maximumSize; i++) {
				this.createReusable();
			}
		}
	},

	createReusable: function() {
		// Increment the size
		this.size++;

		// Construct the new reusable
		var reusable = new this.reusableClass(this);
		
		// Set the new reusable by unique identifier in the busy reusables object
		this.busyReusables[reusable.uniqueIdentifier] = reusable;

		return reusable;
	},

	getReusable: function() {
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
				Console.log('Waiting for reusable...');

				// If we can start the process of creating a new reusable
				if(this.size < this.maximumSize) {
					Console.log(this.size, 'is less than', this.maximumSize, 'creating new reusable...');

					// Create a new reusable
					this.createReusable();
				}

				// Register to get the next available reusable
				this.once('availableReusable', function(event) {
					Console.standardLog('availableReusable event', event);

					// We must stop the event otherwise others waiting for available reusables will receive the event
					event.stop();

					// Take the available reusable
					resolve(this.takeAvailableReusable(event.data));
				}.bind(this));
			}
		}.bind(this));
	},

	getReusableByUniqueIdentifier: function(uniqueIdentifier) {
		var reusable = null;

		if(this.availableReusables[uniqueIdentifier]) {
			reusable = this.availableReusables[uniqueIdentifier];
		}
		else if(this.busyReusables[uniqueIdentifier]) {
			reusable = this.busyReusables[uniqueIdentifier];
		}

		return reusable;
	},

	takeAvailableReusable: function(reusable) {
		//Console.standardLog('taking available reusable', reusable);

		// Remove the reusable from the available list
		delete this.availableReusables[reusable.uniqueIdentifier];

		// Mark the usuable as unavailable
		reusable.available = false;

		// Add the reusable to the busy list
		this.busyReusables[reusable.uniqueIdentifier] = reusable;

		// The reusable to return
		var reusable = this.busyReusables[reusable.uniqueIdentifier];

		this.waitingForAvailableReusableCount--;
		
		return reusable;
	},

	releaseReusable: function(reusable) {
		// Remove the reusable from the busy list
		delete this.busyReusables[reusable.uniqueIdentifier];

		// Mark the usuable as available
		reusable.available = true;

		// Add the reusable to the available list
		this.availableReusables[reusable.uniqueIdentifier] = reusable;

		// Emit an event letting any listeners know we have a free reusable
		this.emit('availableReusable', reusable);

		return reusable;
	},

	retireReusable: function(reusable) {
		// Remove the reusable from the 
		if(reusable.available) {
			delete this.availableReusables[reusable.uniqueIdentifier];
		}
		else {
			delete this.busyReusables[reusable.uniqueIdentifier];
		}

		reusable = null;

		this.size--;

		// Create a new reusable if we are below the minimum size or if there is someone waiting for an available reusable
		if((this.size < this.minimumSize) || (this.waitingForAvailableReusableCount > 0)) {
			this.createReusable();
		}
	},

	retireReusableByUniqueIdentifier: function(uniqueIdentifier) {
		this.retireReusable(this.getReusableByUniqueIdentifier(uniqueIdentifier));
	},
	
});

// Export
module.exports = Pool;