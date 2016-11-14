// Dependencies
import Module from 'system/module/Module.js';
import Version from 'system/version/Version.js';

// Class
class ArchiveModule extends Module {

	version = new Version('0.1.0');

	defaultSettings = {
		sevenZip: {
			executable:
				app.onWindows() ? Node.Path.join(app.framework.directory, 'system', 'archive', 'libraries', '7-zip', 'windows', '7z.exe') :
				app.onMacOs() ? Node.Path.join(app.framework.directory, 'system', 'archive', 'libraries', '7-zip', 'macos', '7z') :
				app.onLinux() ? Node.Path.join(app.framework.directory, 'system', 'archive', 'libraries', '7-zip', 'linux', '7z') : null,
		},
	};
	
}

// Export
export default ArchiveModule;
