ZipModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'ZipFile',
		'ZipDecryptionHeader',
		'ZipExtraDataRecord',
		'central-directory/ZipCentralDirectory',
		'central-directory/ZipEndOfCentralDirectoryRecord',
		'file-system-objects/ZippedFileSystemObject',
		'file-system-objects/ZippedFile',
		'file-system-objects/ZippedDirectory',
		'file-system-objects/headers/ZipZippedFileSystemObjectHeader',
		'file-system-objects/headers/ZipLocalZippedFileSystemObjectHeader',
		'file-system-objects/headers/ZipCentralDirectoryZippedFileSystemObjectHeader',
	],
	
});