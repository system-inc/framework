// Class
class Reusable {
	
	pool = null;

	identifier = null;

	available = false;

	timeInMillisecondsToWaitToRetireWhenAvailable = null;
	scheduledFunctionForTimeInMillisecondsToWaitToRetireWhenAvailable = null;

	constructor(pool) {
		// Keep a reference to the pool
		this.pool = pool;

		// Inherit auto-retirement settings from the pool
		this.timeInMillisecondsToWaitToRetireWhenAvailable = this.pool.timeInMillisecondsToWaitToRetireAvailableReusables;

		// Create a unique identifier
		this.identifier = String.uniqueIdentifier();

		// Intialize
		this.initialize();
	}

	async initialize() {
		await this.release();
	}

	taken() {
		//console.info('Reusable taken');

		// Cancel any currently scheduled retirement
		this.cancelScheduledRetirement();

		// Mark the reusuable as unavailable
		this.available = false;
	}

	release() {
		this.pool.releaseReusable(this);
	}

	released() {
		// Mark the reusable as available
		this.available = true;

		// Schedule retirement
		this.scheduleRetirement();
	}

	retire() {
		// Cancel any currently scheduled retirement
		this.cancelScheduledRetirement();

		//app.log('Retiring!');
		this.pool.retireReusable(this);
	}

	scheduleRetirement() {
		if(this.timeInMillisecondsToWaitToRetireWhenAvailable) {
			//app.log('Scheduling retirement after', this.timeInMillisecondsToWaitToRetireWhenAvailable, 'milliseconds');

			// Cancel the currently scheduled retirement
			this.cancelScheduledRetirement();

			this.scheduledFunctionForTimeInMillisecondsToWaitToRetireWhenAvailable = Function.schedule(this.timeInMillisecondsToWaitToRetireWhenAvailable, function() {
				//app.log(this.timeInMillisecondsToWaitToRetireWhenAvailable, 'milliseconds have passed, may possibly retire...');

				if(this.pool.shouldRetireReusable()) {
					//app.log('this.pool.shouldRetireReusable() returned true');
					this.retire();	
				}
				else {
					//app.log('this.pool.shouldRetireReusable() returned false');
				}
			}.bind(this));	
		}
	}

	cancelScheduledRetirement() {
		//app.log('Reusable cancelScheduledRetirement');

		if(this.scheduledFunctionForTimeInMillisecondsToWaitToRetireWhenAvailable) {
			Function.cancel(this.scheduledFunctionForTimeInMillisecondsToWaitToRetireWhenAvailable);
			this.scheduledFunctionForTimeInMillisecondsToWaitToRetireWhenAvailable = null;
			//app.log('Canceled scheduled retirement function');
		}
		else {
			//app.log('No scheduled retirement function to cancel');
		}
	}

}

// Export
export { Reusable };
