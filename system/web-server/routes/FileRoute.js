// Dependencies
var Route = Framework.require('system/web-server/routes/Route.js');
var File = Framework.require('system/file-system/File.js');

// Class
var FileRoute = Route.extend({

	type: 'file',
	filePath: null,

	construct: function(settings, parent) {
		this.super.apply(this, arguments);
		
		this.inheritProperty('filePath', settings, parent);

		// Make sure filePath is a normalized path
		if(!Object.isEmpty(this.filePath)) {
			this.filePath = Node.Path.normalize(this.filePath);
		}
	},

	follow: function*(request, response) {
		// Build the file path
		var filePath;

		// If the file path is * or not set, use the URL path
		if(this.filePath == '*' || Object.isEmpty(this.filePath)) {
			filePath = Node.Path.join(request.webServer.directory, 'views', request.url.path);
		}
		// If a file path is specified, use it
		else if(this.filePath) {
			filePath = Node.Path.join(request.webServer.directory, 'views', this.filePath);
		}
		//Console.highlight(filePath);

		response.content = new File(filePath);

		// Send the response
		response.send();
	},

});

// Export
module.exports = FileRoute;