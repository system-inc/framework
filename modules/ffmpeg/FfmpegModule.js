FfmpegModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'Ffmpeg',
	],

	initialize: function*(settings) {
		yield this.super.apply(this, arguments);

		// The ffmpeg binary file
		var file = Node.Path.join(Project.directory, 'libraries', 'ffmpeg');
		if(Project.onWindows()) {
			file = Node.Path.join(file, 'windows', 'ffmpeg.exe');
		}
		else if(Project.onOsX()) {
			file = Node.Path.join(file, 'os-x', 'ffmpeg');
		}
		else if(Project.onLinux()) {
			file = Node.Path.join(file, 'linux', 'ffmpeg');
		}
		//Console.out(file);

		this.settings.default({
			file: file,
		});
	},
	
});