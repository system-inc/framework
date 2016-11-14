// Dependencies
import Module from 'system/module/Module.js';
import Version from 'system/version/Version.js';

// Class
class FfmpegModule extends Module {

	version = new Version('0.1.0');

	defaultSettings = {
		executable:
			app.onWindows() ? Node.Path.join(app.directory, 'libraries', 'ffmpeg', 'windows', 'ffmpeg.exe') :
			app.onMacOs() ? Node.Path.join(app.directory, 'libraries', 'ffmpeg', 'macos', 'ffmpeg') :
			app.onLinux() ? Node.Path.join(app.directory, 'libraries', 'ffmpeg', 'linux', 'ffmpeg') : null,
	};
	
}

// Export
export default FfmpegModule;
