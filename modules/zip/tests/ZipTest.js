ZipTest = Test.extend({	

	testZip: function*() {
		//var actual = yield FrameworkTestDatabase.query('SELECT * FROM user');
		//Console.out(actual);
	
		var zipFilePath = __dirname+Node.Path.separator+'zip-files'+Node.Path.separator+'zip-file-with-comment.zip';
		//var zipFilePath = '/Users/kirkouimet/Desktop/comic.cbr';
		//Console.out(zipFilePath);

		// Read the zip file from disk
		var zipFile = new ZipFile(zipFilePath);
		//Console.out(zipFile);

		// List the zip file's contents
		var zipFileList = yield zipFile.list();
		//zipFileList.each(function(index, zipFileSystemObject) {
		//});
		Console.out(zipFile, zipFileList);

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

	//new ZipFile() // create an in memory zip file
	//new ZipFile(doesnotexistyet.zip) // create an in memory zip which will save to doesnotexistyet.zip
	//new ZipFile(exists.zip) // read a zip from disk
	//zipFile.getFileSystemObjects()

	// Create a zip file
		// Add files to the zip file
		// Add folders to the zip file
		// Add a comment on a file

	// Read a zip file

});