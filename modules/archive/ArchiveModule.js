ArchiveModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'libraries/7-zip/SevenZip',
		'ArchiveFile',
		'file-system-objects/ArchivedFileSystemObject',
		'file-system-objects/ArchivedFile',
		'file-system-objects/ArchivedDirectory',
	],

	initialize: function*(settings) {
		yield this.super.apply(this, arguments);

		// Set the path to the 7-Zip executable file
		var sevenZipExecutable = Node.Path.join(Project.framework.directory, 'modules', 'archive', 'libraries', '7-zip');
		if(Project.onWindows()) {
			sevenZipExecutable = Node.Path.join(sevenZipExecutable, 'windows', '7z.exe');
		}
		else if(Project.onOsX()) {
			sevenZipExecutable = Node.Path.join(sevenZipExecutable, 'os-x', '7z');
		}
		else if(Project.onLinux()) {
			sevenZipExecutable = Node.Path.join(sevenZipExecutable, 'linux', '7z');
		}
		//Console.out(sevenZipExecutable);

		this.settings.default({
			sevenZip: {
				executable: sevenZipExecutable,
			},
		});
	},
	
});