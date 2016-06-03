// Class
var Reusable = Class.extend({
	
	pool: null,
	uniqueIdentifier: null,
	available: false,

	construct: function(pool) {
		// Keep a reference to the pool
		this.pool = pool;

		// Create a unique identifier
		this.uniqueIdentifier = String.uniqueIdentifier();

		// Intialize
		this.initialize();
	},

	initialize: function() {
		this.pool.freeReusable(this);
	},

	reset: function() {
		this.pool.freeReusable(this);
	},

	free: function() {
		this.pool.freeReusable(this);
	},	

	retire: function() {
		this.pool.retireReusable(this);
	},
	
});

// Export
module.exports = Reusable;