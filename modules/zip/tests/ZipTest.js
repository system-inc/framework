ZipTest = Test.extend({

	testReadFromPath: function*() {
		//var actual = yield FrameworkTestDatabase.query('SELECT * FROM user');
		//Console.out(actual);
	
		var zipFilePath = Node.Path.join(__dirname, 'files', 'zip-file-with-comment.zip');
		//var zipFilePath = '/Users/kirkouimet/Desktop/Share/comic.cbz';
		//var zipFilePath = 'C:\\Users\\Kirk Ouimet\\Desktop\\Share\\Test Folder 1\\comic.cbz';
		//Console.out(zipFilePath);

		// Read the zip file from disk
		var zipFile = new ZipFile(zipFilePath);
		//Console.out(zipFile);

		// List the zip file's contents
		var zipFileList = yield zipFile.list();
		//Console.highlight(zipFile);

		//zipFileList.each(function(index, zipFileSystemObject) {
			//Console.out(zipFileSystemObject);
			//Console.out(zipFileSystemObject.path);
		//});

		var zippedFile = zipFileList.last();
		//Console.out(zippedFile);

		// Read the local header for the zipped file
		yield zippedFile.readLocalHeader();
		//Console.out('zippedFile.localHeader', zippedFile.localHeader);
		//Console.out('zippedFile.centralDirectoryHeader', zippedFile.centralDirectoryHeader);

		//var zippedFileReadStream = yield zippedFile.toReadStream();
		//zippedFileReadStream.on('data', function(chunk) {
		//	Console.out('chunk', chunk);
		//});
		//zippedFileReadStream.on('end', function(chunk) {
		//	Console.out('no more data');
		//});

		// Extract a file or directory from the zip file to a specific path
		//zipFile.extract(zipFileSystemObjectPath, path);

		// Extract all of the files from the zip file
		//zipFile.extract(path)

		// Add a file or directory to the zip file
		//zipFile.add(path, options (comment, encoding, etc.));

		// Remove a file or directory from the zip file
		//zipFile.remove(path);

		// Save a zip file
		//zipFile.save();

		// Convert the zip file to a buffer
		//zipFile.toBuffer()

		//var actual = yield zipFile.list();
		//Console.out(actual);
	},

	testReadFromMemory: function*() {
	},

	testCreateInMemory: function*() {
		// Create the zip file
		//var zipFile = new ZipFile();

		// Add empty file

		// Add file with content

		// Add file with content with comment

		// Add empty directory

		// Add directory with content

		// Add comment to directory

		// Add a comment to the zip

		// Save to disk

		// Read and verify zip file has everything that was created
	},

	testCreateInMemoryWithPath: function*() {
	},

});