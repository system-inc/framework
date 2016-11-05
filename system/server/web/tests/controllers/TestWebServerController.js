// Dependencies
import WebServerController from './../../../../system/server/web/WebServerController.js';
import InternalServerError from './../../../../system/server/web/errors/InternalServerError.js';
import BadRequestError from './../../../../system/server/web/errors/BadRequestError.js';
import ForbiddenError from './../../../../system/server/web/errors/ForbiddenError.js';
import RequestedRangeNotSatisfiableError from './../../../../system/server/web/errors/RequestedRangeNotSatisfiableError.js';
import RequestEntityTooLargeError from './../../../../system/server/web/errors/RequestEntityTooLargeError.js';
import UnauthorizedError from './../../../../system/server/web/errors/UnauthorizedError.js';
import ArchiveFile from './../../../../system/archive/ArchiveFile.js';
import File from './../../../../system/file-system/File.js';
import Html from './../../../../system/interface/graphical/web/html/Html.js';
import HtmlDocument from './../../../../system/interface/graphical/web/html/HtmlDocument.js';

// Class
class TestWebServerController extends WebServerController {

	async root() {
		return this.data.root;

		//return {
		//	request: this.request,
		//	response: this.response,
		//};
	}

	cookies() {
		this.response.cookies.set('testCookie1', 'testCookie1Value');
		this.response.cookies.set('testCookie2', {
			cookieObjectKey1: ['a', 'b', 'c'],
			cookieObjectKey2: ['d', 'e', 'f'],
		});
		//app.warn(this.response.headers);
		//app.warn(this.response.cookies);

		return 'Route with cookies.';
	}

	throwInternalServerErrorInFunction() {
		throw new InternalServerError('Internal Server Error thrown in function.');
	}

	async throwInternalServerErrorInGenerator() {
		throw new InternalServerError('Internal Server Error thrown in generator.');
	}

	async throwBadRequestError() {
		throw new BadRequestError();
	}

	async throwForbiddenError() {
		throw new ForbiddenError();
	}

	async throwRequestedRangeNotSatisfiableError() {
		throw new RequestedRangeNotSatisfiableError();
	}

	async throwRequestEntityTooLargeError() {
		throw new RequestEntityTooLargeError();
	}

	async throwUnauthorizedError() {
		throw new UnauthorizedError();
	}

	item() {
		return this.data;
	}

	relatedItem() {
		return this.data;
	}

	putOnly() {
		return 'This method is only invoked on requests using the PUT method.';
	}

	levelOne() {
		return this.data;
	}

	levelOneLevelTwo() {
		return this.data;
	}

	levelOneLevelTwoLevelThree() {
		return this.data;
	}

	async contentArchivedFile() {
		var archiveFile = new ArchiveFile(Node.Path.join(app.framework.directory, 'system', 'web-server', 'tests', 'views', 'files', 'archives', 'archive-text.zip'));
		//app.log('archiveFile', archiveFile);

		var archivedFileSystemObjects = await archiveFile.list();
		//app.log('archivedFileSystemObjects', archivedFileSystemObjects);

		var archivedFileText = archivedFileSystemObjects.first();

		return archivedFileText;
	}

	contentFile() {
		var file = new File(Node.Path.join(app.framework.directory, 'system', 'web-server', 'tests', 'views', 'files', 'text', 'data.txt'));

		return file;
	}

	contentHtmlDocument() {
		var htmlDocument = new HtmlDocument();

		htmlDocument.body.append(Html.p('Test HTML document.'));

		return htmlDocument;
	}

	contentObject() {
		return {
			a: 1,
			b: 2,
			c: 3,
		};
	}

	contentString() {
		return 'Content is string.';
	}

	contentBuffer() {
		return new Buffer('Content is buffer.');
	}

	contentStream() {
		var stream = new Stream();
		stream.readable = true;
		var c = 64;
		var iv = setInterval(function () {
			if(++c >= 75) {
				clearInterval(iv);
				stream.emit('end');
			}
			else stream.emit('data', String.fromCharCode(c));
		}, 1);

		return stream;
	}

	apiHelloWorld() {
		return {
			data: {
				message: 'Hello world.',
			},
		};
	}

	async apiDataNumbers() {
		return '0123456789';
	}
	
}

// Export
export default TestWebServerController;
