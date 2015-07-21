ArchiveModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'ArchiveFile',
		'file-system-objects/ArchivedFileSystemObject',
	],
	
});