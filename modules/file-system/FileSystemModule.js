FileSystemModule = Module.extend({

	version: new Version('0.1.0'),

	dependencies: [
		'FileSystem',
		'FileSystemObject',
		'Directory',
		'File',
		'FileFormats',
	],
	
});