FfmpegWrapper = Class.extend({

});

// Static methods
FfmpegWrapper.resizeImage = function*(imageFile, newWidth, newHeight) {
	// Initialize the file status
	yield imageFile.initializeStatus();

	return imageFile;

	// Pass the file and new size to ffmpeg

	// Get the new file back in memory

	// Returns image in memory
}.toPromise();

FfmpegWrapper.transcodeVideo = function*(videoFile, options) {
	var options = {
		default1: '',
		default2: '',
		default3: '',
	}.merge(options);

	// Create the command line call to ffmpeg

	// Get the bytes back

	return options;
}.toPromise();