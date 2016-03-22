// Dependencies
var WebServerController = Framework.require('system/web-server/WebServerController.js');
var InternalServerError = Framework.require('system/web-server/errors/InternalServerError.js');
var BadRequestError = Framework.require('system/web-server/errors/BadRequestError.js');
var ForbiddenError = Framework.require('system/web-server/errors/ForbiddenError.js');
var RequestedRangeNotSatisfiableError = Framework.require('system/web-server/errors/RequestedRangeNotSatisfiableError.js');
var RequestEntityTooLargeError = Framework.require('system/web-server/errors/RequestEntityTooLargeError.js');
var UnauthorizedError = Framework.require('system/web-server/errors/UnauthorizedError.js');
var ArchiveFile = Framework.require('system/archive/ArchiveFile.js');
var File = Framework.require('system/file-system/File.js');
var Html = Framework.require('system/html/Html.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');

// Class
var TestWebServerController = WebServerController.extend({

	root: function*() {
		return this.data.root;

		//return {
		//	request: this.request,
		//	response: this.response,
		//};
	},

	cookies: function() {
		this.response.cookies.set('testCookie1', 'testCookie1Value');
		this.response.cookies.set('testCookie2', {
			cookieObjectKey1: ['a', 'b', 'c'],
			cookieObjectKey2: ['d', 'e', 'f'],
		});
		//Console.warn(this.response.headers);
		//Console.warn(this.response.cookies);

		return 'Route with cookies.';
	},

	throwInternalServerErrorInFunction: function() {
		throw new InternalServerError('Internal Server Error thrown in function.');
	},

	throwInternalServerErrorInGenerator: function*() {
		throw new InternalServerError('Internal Server Error thrown in generator.');
	},

	throwBadRequestError: function*() {
		throw new BadRequestError();
	},

	throwForbiddenError: function*() {
		throw new ForbiddenError();
	},

	throwRequestedRangeNotSatisfiableError: function*() {
		throw new RequestedRangeNotSatisfiableError();
	},

	throwRequestEntityTooLargeError: function*() {
		throw new RequestEntityTooLargeError();
	},

	throwUnauthorizedError: function*() {
		throw new UnauthorizedError();
	},

	item: function() {
		return this.data;
	},

	relatedItem: function() {
		return this.data;
	},

	putOnly: function() {
		return 'This method is only invoked on requests using the PUT method.';
	},

	levelOne: function() {
		return this.data;
	},

	levelOneLevelTwo: function() {
		return this.data;
	},

	levelOneLevelTwoLevelThree: function() {
		return this.data;
	},

	contentArchivedFile: function*() {
		var archiveFile = new ArchiveFile(Node.Path.join(Framework.directory, 'system', 'web-server', 'tests', 'views', 'files', 'archives', 'archive-text.zip'));
		//Console.log('archiveFile', archiveFile);

		var archivedFileSystemObjects = yield archiveFile.list();
		//Console.log('archivedFileSystemObjects', archivedFileSystemObjects);

		var archivedFileText = archivedFileSystemObjects.first();

		return archivedFileText;
	},

	contentFile: function() {
		var file = new File(Node.Path.join(Framework.directory, 'system', 'web-server', 'tests', 'views', 'files', 'text', 'data.txt'));

		return file;
	},

	contentHtmlDocument: function() {
		var htmlDocument = new HtmlDocument();

		htmlDocument.body.append(Html.p('Test HTML document.'));

		return htmlDocument;
	},

	contentObject: function() {
		return {
			a: 1,
			b: 2,
			c: 3,
		};
	},

	contentString: function() {
		return 'Content is string.';
	},

	contentBuffer: function() {
		return new Buffer('Content is buffer.');
	},

	contentStream: function() {
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
	},

	apiHelloWorld: function() {
		return {
			data: {
				message: 'Hello world.',
			},
		};
	},

	apiDataNumbers: function*() {
		return '0123456789';
	},
	
});

// Export
module.exports = TestWebServerController;