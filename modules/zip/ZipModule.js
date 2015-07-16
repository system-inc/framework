ZipModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'ZipFile',
		'ZipDecryptionHeader',
		'ZipExtraDataRecord',
		'ZipCentralDirectory',
		'ZipCentralDirectoryZippedFileSystemObjectHeader',
		'ZipLocalZippedFileSystemObjectHeader',
		'ZipEndOfCentralDirectoryRecord',
		'ZippedFileSystemObject',
		'ZippedFile',
		'ZippedDirectory',
	],
	
});