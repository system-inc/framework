// Class
var ArchiveModule = Module.extend({

	version: new Version('0.1.0'),

	defaultSettings: {
		sevenZip: {
			executable:
				Project.onWindows() ? Node.Path.join(Project.framework.directory, 'modules', 'archive', 'libraries', '7-zip', 'windows', '7z.exe') :
				Project.onOsX() ? Node.Path.join(Project.framework.directory, 'modules', 'archive', 'libraries', '7-zip', 'os-x', '7z') :
				Project.onLinux() ? Node.Path.join(Project.framework.directory, 'modules', 'archive', 'libraries', '7-zip', 'linux', '7z') : null,
		},
	},
	
});

// Export
module.exports = ArchiveModule;