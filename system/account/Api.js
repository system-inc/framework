Api = Class.extend({

	construct: function() {
	},

});

Api.throttle = function(request) {
	// Check memcached to see how many times the IP address has requested the same path within the last 24 hours
	var requestCount = MemoryCache.get('requests.'+request.ipAddress+'.'+request.path, 60 * 60 * 24);

	// Check how many requests have been within the last 60 seconds
	var time = new Time();
	var minuteCount = 0;
	requestCount.each(function(requestIndex, request) {
		if(request.timeInMilliseconds - 60 * 1000 < time.inMilliseconds()) {
			minuteCount++;
		}
	});

	// If the request count is greater than 10, throw an exception
	if(minuteCount > 10) {
		// The policy's metrics should not be disclosed to users
		throw new TooManyRequestsError('Too many requests in too short of time. Wait for awhile and try again.');
	}

	// TODO:
	// Disable an account after a number of failed logins
	// Ban IP address after too many requests
}