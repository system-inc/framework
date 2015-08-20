ZipModule = Module.extend({

	version: new Version('0.1.0'),

	needs: [
		'Archive',
	],

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

	initialize: function*(settings) {
		yield this.super.apply(this, arguments);

		// Register zip file formats as archive extensions
		ArchiveFile.registerImplementation('Zip', [
			'zip',
			'cbz',
		]);
	},
	
});