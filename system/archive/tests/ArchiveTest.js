// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import ArchiveFile from 'framework/system/archive/ArchiveFile.js';

// Class
class ArchiveTest extends Test {

	async testZipWithComment() {
		var archiveFilePath = Node.Path.join(__dirname, 'files', 'zip-with-comment.zip');
		//app.log('archiveFilePath', archiveFilePath);

		var archiveFile = new ArchiveFile(archiveFilePath);

		var archivedFileSystemObjects = await archiveFile.list();
		//app.highlight('archivedFileSystemObjects', archivedFileSystemObjects);

		var archivedFile = archivedFileSystemObjects.second();
		//app.highlight('archivedFile', archivedFile);

		var archivedFileStream = await archivedFile.toReadStream();
		//app.highlight('archivedFileStream', archivedFileStream);

		var archivedFileString = await archivedFileStream.toString();
		//app.highlight('archivedFileString', archivedFileString);

		Assert.equal(archivedFileString, "Hi! This zip file has a comment inside of it.\r\n\r\nEnjoy!\r\n\r\nKirk\r\n");
	}

	async testRarWithComment() {
		var archiveFilePath = Node.Path.join(__dirname, 'files', 'rar-with-comment.rar');
		//app.log('archiveFilePath', archiveFilePath);

		var archiveFile = new ArchiveFile(archiveFilePath);

		var archivedFileSystemObjects = await archiveFile.list();
		//app.highlight('archivedFileSystemObjects', archivedFileSystemObjects);

		var archivedFile = archivedFileSystemObjects.third();
		//app.highlight('archivedFile', archivedFile);

		var archivedFileStream = await archivedFile.toReadStream();
		//app.highlight('archivedFileStream', archivedFileStream);

		var archivedFileString = await archivedFileStream.toString();
		//app.highlight('archivedFileString', archivedFileString);

		Assert.equal(archivedFileString, "File D!\r\n\r\nWoo hoo.");
	}

	async testRar5WithComment() {
		var archiveFilePath = Node.Path.join(__dirname, 'files', 'rar5-with-comment.rar');
		//app.log('archiveFilePath', archiveFilePath);

		var archiveFile = new ArchiveFile(archiveFilePath);

		var archivedFileSystemObjects = await archiveFile.list();
		//app.highlight('archivedFileSystemObjects', archivedFileSystemObjects);

		var archivedFile = archivedFileSystemObjects.third();
		//app.highlight('archivedFile', archivedFile);

		var archivedFileStream = await archivedFile.toReadStream();
		//app.highlight('archivedFileStream', archivedFileStream);

		var archivedFileString = await archivedFileStream.toString();
		//app.highlight('archivedFileString', archivedFileString);

		Assert.equal(archivedFileString, "File D!\r\n\r\nWoo hoo.");
	}

}

// Export
export default ArchiveTest;
