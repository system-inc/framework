TestReporter = Class.extend({

	construct: function() {
	},

	on: function(eventName, callback) {
		Framework.on(eventName, callback);
	},

});