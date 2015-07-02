ZipTest = Test.extend({	

	testZip: function*() {
		//var actual = yield FrameworkTestDatabase.query('SELECT * FROM user');
		//Console.out(actual);
	
		var zipFilePath = __dirname+'/zip-files'+Node.Path.separator+'zip-file-1.zip';
		var zipFile = new ZipFile(zipFilePath);
		Console.out(zipFile);

		var fileSystemObjectReferences = zipFile.getFileSystemObjectReferences();

				
	},

});