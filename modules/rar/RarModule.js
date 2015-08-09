RarModule = Module.extend({

	version: new Version('0.1.0'),

	needs: [
		'Archive',
	],

	uses: [
		'RarFile',
		'RarFileHeader',
		'RarBlockHeader',
		'file-system-objects/RarredFileSystemObject',
		'file-system-objects/RarredFile',
		'file-system-objects/RarredDirectory',
	],

	initialize: function(settings) {
		this.super.apply(this, arguments);

		// Register zip file formats as archive extensions
		ArchiveFile.registerImplementation('Rar', [
			'rar',
			'cbr',
		]);
	},
	
});