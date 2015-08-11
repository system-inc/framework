RarTest = Test.extend({

	testReadFromPath: function*() {
		var rarFilePath = Node.Path.join(__dirname, 'files', 'rar-file-with-comment.rar');
		//var rarFilePath = '/Users/kirkouimet/Desktop/Share/comic.cbz';
		//var rarFilePath = 'C:\\Users\\Kirk Ouimet\\Desktop\\Share\\Test Folder 1\\comic.cbz';
		//Console.out(rarFilePath);

		// Read the rar file from disk
		var rarFile = new RarFile(rarFilePath);
		//Console.out(rarFile);

		// List the rar file's contents
		var rarredFileSystemObjects = yield rarFile.list();
		//Node.exit(rarredFileSystemObjects);

		var firstRarredFileSystemObject = rarredFileSystemObjects.first();
		//Console.out(firstRarredFileSystemObject.path);
		var firstRarredFileSystemObjectStream = yield firstRarredFileSystemObject.toReadStream();
		var firstRarredFileSystemObjectStreamString = yield firstRarredFileSystemObjectStream.toString();
		//Console.out(firstRarredFileSystemObjectStreamString);
		Assert.equal(firstRarredFileSystemObjectStreamString, "File B!\r\n\r\nWowza.", 'Extracts first file stored with compression method "store"');

		var secondRarredFileSystemObject = rarredFileSystemObjects.second();
		//Console.out(secondRarredFileSystemObject.path);
		var secondRarredFileSystemObjectStream = yield secondRarredFileSystemObject.toReadStream();
		var secondRarredFileSystemObjectStreamString = yield secondRarredFileSystemObjectStream.toString();
		//Console.out(secondRarredFileSystemObjectStreamString);
		Assert.equal(secondRarredFileSystemObjectStreamString, "File C!\r\n\r\nYay.", 'Extracts second file stored with compression method "store"');

		var thirdRarredFileSystemObject = rarredFileSystemObjects.third();
		//Console.out(thirdRarredFileSystemObject.path);
		var thirdRarredFileSystemObjectStream = yield thirdRarredFileSystemObject.toReadStream();
		var thirdRarredFileSystemObjectStreamString = yield thirdRarredFileSystemObjectStream.toString();
		//Console.out(thirdRarredFileSystemObjectStreamString);
		Assert.equal(thirdRarredFileSystemObjectStreamString, "File D!\r\n\r\nWoo hoo.", 'Extracts third file stored with compression method "store"');

		//var rarpedFile = rarredFileSystemObjects.last();
		//Console.out(rarpedFile);

		// Read the local header for the rarped file
		//yield rarpedFile.readLocalHeader();

	},

	testArchiveMethodNormal: function*() {
		var rarFilePath = Node.Path.join(__dirname, 'files', 'rar-file-archive-method-normal.rar');
		var rarFile = new RarFile(rarFilePath);
		var rarredFileSystemObjects = yield rarFile.list();
		var firstRarredFileSystemObject = rarredFileSystemObjects.first();
		var firstRarredFileSystemObjectStream = yield firstRarredFileSystemObject.toReadStream();
		var firstRarredFileSystemObjectStreamString = yield firstRarredFileSystemObjectStream.toString();
		Console.out(firstRarredFileSystemObjectStreamString);
	},

});