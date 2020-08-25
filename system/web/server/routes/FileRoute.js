// Dependencies
import { Route } from '@framework/system/web/server/routes/Route.js';
import { File } from '@framework/system/file-system/File.js';

// Class
class FileRoute extends Route {

	type = 'file';
	filePath = null;

	constructor(settings, parent) {
		super(...arguments);

		this.inheritProperty('filePath', settings, parent);

		// Make sure filePath is a normalized path
		if(!Object.isEmpty(this.filePath)) {
			this.filePath = Node.Path.normalize(this.filePath);
		}
	}

	async follow(request, response) {
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
		//app.highlight(filePath);

		response.content = new File(filePath);

		// Send the response
		await super.follow(...arguments);
	}

}

// Export
export { FileRoute };
