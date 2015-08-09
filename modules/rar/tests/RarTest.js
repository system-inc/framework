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
		var rarFileList = yield rarFile.list();
		//Node.exit(rarFileList);

		//rarFileList.each(function(index, rarFileSystemObject) {
			//Console.out(rarFileSystemObject);
			//Console.out(rarFileSystemObject.path);
		//});

		//var rarpedFile = rarFileList.last();
		//Console.out(rarpedFile);

		// Read the local header for the rarped file
		//yield rarpedFile.readLocalHeader();

	},

});