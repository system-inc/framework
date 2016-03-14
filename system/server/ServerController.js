// Class
var ServerController = Class.extend({

	request: null,
	response: null,

	construct: function(request, response) {
		this.request = request;
		this.response = response;
	},
	
});

// Export
module.exports = ServerController;