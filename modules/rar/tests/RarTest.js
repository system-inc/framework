RarTest = Test.extend({

	testReadFromPath: function*() {
		var rarFilePath = Node.Path.join(__dirname, 'files', 'rar-with-comment.rar');
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

	testAllRarArchiveMethods: function*() {
		var files = [
			//'rar-archive-method-best.rar',
			//'rar-archive-method-fast.rar',
			//'rar-archive-method-fastest.rar',
			//'rar-archive-method-good.rar',
			//'rar-archive-method-normal.rar',
			'rar-archive-method-store.rar',
		];

		yield files.each(function*(index, file) {
			var rarFilePath = Node.Path.join(__dirname, 'files', file);
			var rarFile = new RarFile(rarFilePath);
			var rarredFileSystemObjects = yield rarFile.list();
			var firstRarredFileSystemObject = rarredFileSystemObjects.first();
			var firstRarredFileSystemObjectStream = yield firstRarredFileSystemObject.toReadStream();
			//Console.out(firstRarredFileSystemObjectStream);
			var firstRarredFileSystemObjectStreamString = yield firstRarredFileSystemObjectStream.toString();
			Console.out(firstRarredFileSystemObjectStreamString);
		});
	},

	//testAllRar5ArchiveMethods: function*() {
	//	var files = [
	//		'rar5-archive-method-best.rar',
	//		'rar5-archive-method-fast.rar',
	//		'rar5-archive-method-fastest.rar',
	//		'rar5-archive-method-good.rar',
	//		'rar5-archive-method-normal.rar',
	//		'rar5-archive-method-store.rar',
	//	];

	//	yield files.each(function*(index, file) {
	//		var rarFilePath = Node.Path.join(__dirname, 'files', file);
	//		var rarFile = new RarFile(rarFilePath);
	//		var rarredFileSystemObjects = yield rarFile.list();
	//		var firstRarredFileSystemObject = rarredFileSystemObjects.first();
	//		var firstRarredFileSystemObjectStream = yield firstRarredFileSystemObject.toReadStream();
	//		Console.out(firstRarredFileSystemObjectStream);
	//		//var firstRarredFileSystemObjectStreamString = yield firstRarredFileSystemObjectStream.toString();
	//		//Console.out(firstRarredFileSystemObjectStreamString);
	//	});
	//},

});