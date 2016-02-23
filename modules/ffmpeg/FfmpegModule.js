// Class
var FfmpegModule = Module.extend({

	version: new Version('0.1.0'),

	defaultSettings: {
		executable:
			Project.onWindows() ? Node.Path.join(Project.directory, 'libraries', 'ffmpeg', 'windows', 'ffmpeg.exe') :
			Project.onOsX() ? Node.Path.join(Project.directory, 'libraries', 'ffmpeg', 'os-x', 'ffmpeg') :
			Project.onLinux() ? Node.Path.join(Project.directory, 'libraries', 'ffmpeg', 'linux', 'ffmpeg') : null,
	},
	
});

// Export
module.exports = FfmpegModule;