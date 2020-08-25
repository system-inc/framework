// Dependencies
import { WebServerController } from '@framework/system/web/server/WebServerController.js';
import { InternalServerError } from '@framework/system/web/server/errors/InternalServerError.js';
import { BadRequestError } from '@framework/system/web/server/errors/BadRequestError.js';
import { ForbiddenError } from '@framework/system/web/server/errors/ForbiddenError.js';
import { RequestedRangeNotSatisfiableError } from '@framework/system/web/server/errors/RequestedRangeNotSatisfiableError.js';
import { RequestEntityTooLargeError } from '@framework/system/web/server/errors/RequestEntityTooLargeError.js';
import { UnauthorizedError } from '@framework/system/web/server/errors/UnauthorizedError.js';
import { ArchiveFile } from '@framework/system/archive/ArchiveFile.js';
import { File } from '@framework/system/file-system/File.js';
import { Html } from '@framework/system/interface/graphical/web/html/Html.js';
import { HtmlDocument } from '@framework/system/interface/graphical/web/html/HtmlDocument.js';

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
		var archiveFile = new ArchiveFile(Node.Path.join(app.settings.get('framework.path'), 'system', 'server', 'web', 'tests', 'views', 'files', 'archives', 'archive-text.zip'));
		//app.log('archiveFile', archiveFile);

		var archivedFileSystemObjects = await archiveFile.list();
		//app.log('archivedFileSystemObjects', archivedFileSystemObjects);

		var archivedFileText = archivedFileSystemObjects.first();

		return archivedFileText;
	}

	contentFile() {
		var file = new File(Node.Path.join(app.settings.get('framework.path'), 'system', 'server', 'web', 'tests', 'views', 'files', 'text', 'data.txt'));

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
		return Buffer.from('Content is buffer.');
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
export { TestWebServerController };
