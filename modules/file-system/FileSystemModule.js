FileSystemModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'FileSystem',
		'FileSystemObject',
		'Directory',
		'File',
		'FileFormats',
	],
	
});