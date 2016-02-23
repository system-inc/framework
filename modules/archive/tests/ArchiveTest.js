// Dependencies
var ArchiveFile = Framework.require('modules/archive/ArchiveFile.js');

// Class
var ArchiveTest = Test.extend({

	testZipWithComment: function*() {
		var archiveFilePath = Node.Path.join(__dirname, 'files', 'zip-with-comment.zip');
		//Console.log('archiveFilePath', archiveFilePath);

		var archiveFile = new ArchiveFile(archiveFilePath);

		var archivedFileSystemObjects = yield archiveFile.list();
		//Console.highlight('archivedFileSystemObjects', archivedFileSystemObjects);

		var archivedFile = archivedFileSystemObjects.second();
		//Console.highlight('archivedFile', archivedFile);

		var archivedFileStream = yield archivedFile.toReadStream();
		//Console.highlight('archivedFileStream', archivedFileStream);

		var archivedFileString = yield archivedFileStream.toString();
		//Console.highlight('archivedFileString', archivedFileString);

		Assert.equal(archivedFileString, "Hi! This zip file has a comment inside of it.\r\n\r\nEnjoy!\r\n\r\nKirk\r\n");
	},

	testRarWithComment: function*() {
		var archiveFilePath = Node.Path.join(__dirname, 'files', 'rar-with-comment.rar');
		//Console.log('archiveFilePath', archiveFilePath);

		var archiveFile = new ArchiveFile(archiveFilePath);

		var archivedFileSystemObjects = yield archiveFile.list();
		//Console.highlight('archivedFileSystemObjects', archivedFileSystemObjects);

		var archivedFile = archivedFileSystemObjects.third();
		//Console.highlight('archivedFile', archivedFile);

		var archivedFileStream = yield archivedFile.toReadStream();
		//Console.highlight('archivedFileStream', archivedFileStream);

		var archivedFileString = yield archivedFileStream.toString();
		//Console.highlight('archivedFileString', archivedFileString);

		Assert.equal(archivedFileString, "File D!\r\n\r\nWoo hoo.");
	},

	testRar5WithComment: function*() {
		var archiveFilePath = Node.Path.join(__dirname, 'files', 'rar5-with-comment.rar');
		//Console.log('archiveFilePath', archiveFilePath);

		var archiveFile = new ArchiveFile(archiveFilePath);

		var archivedFileSystemObjects = yield archiveFile.list();
		//Console.highlight('archivedFileSystemObjects', archivedFileSystemObjects);

		var archivedFile = archivedFileSystemObjects.third();
		//Console.highlight('archivedFile', archivedFile);

		var archivedFileStream = yield archivedFile.toReadStream();
		//Console.highlight('archivedFileStream', archivedFileStream);

		var archivedFileString = yield archivedFileStream.toString();
		//Console.highlight('archivedFileString', archivedFileString);

		Assert.equal(archivedFileString, "File D!\r\n\r\nWoo hoo.");
	},

});

// Export
module.exports = ArchiveTest;