// Dependencies
import { Module } from '@framework/system/module/Module.js';
import { Version } from '@framework/system/version/Version.js';

// Class
class FfmpegModule extends Module {

	version = new Version('1.0.0');

	defaultSettings = {
		executable:
			app.onWindows() ? Node.Path.join(app.path, 'libraries', 'ffmpeg', 'windows', 'ffmpeg.exe') :
			app.onMacOs() ? Node.Path.join(app.path, 'libraries', 'ffmpeg', 'macos', 'ffmpeg') :
			app.onLinux() ? Node.Path.join(app.path, 'libraries', 'ffmpeg', 'linux', 'ffmpeg') : null,
	};
	
}

// Export
export { FfmpegModule };
