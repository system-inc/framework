// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');

// Class
var FfmpegTest = Test.extend({

	//testResizeImage: function*() {
	//	var testFilePath = Node.Path.join(Project.framework.directory, 'modules', 'media', 'tests', 'files', 'images', 'test-1.jpg');
	//	var testFile = new File(testFilePath);

	//	var actual = yield FfmpegWrapper.resizeImage(testFile, 50);

	//	//Console.highlight('actual', actual);

	//	//Assert.equal('meh', 'meh2', 'Actual equals expected');
	//},

	//testTranscodeVideo: function*() {
	//	var actual = yield FfmpegWrapper.transcodeVideo('file', {
	//		setting1: 'something else',
	//		bitrate: 1200,
	//	});

	//	//Console.highlight(actual);
	//},

});

// Export
module.exports = FfmpegTest;