ZipModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'ZipFile',
		'ZipEndOfCentralDirectoryRecord',
		'ZipFileSystemObjectReference',
	],
	
});