// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';

// Class
class FfmpegTest extends Test {

	//testResizeImage: function*() {
	//	var testFilePath = Node.Path.join(app.settings.get('framework.path'), 'modules', 'media', 'tests', 'files', 'images', 'test-1.jpg');
	//	var testFile = new File(testFilePath);

	//	var actual = yield FfmpegWrapper.resizeImage(testFile, 50);

	//	//app.highlight('actual', actual);

	//	//Assert.equal('meh', 'meh2', 'Actual equals expected');
	//},

	//testTranscodeVideo: function*() {
	//	var actual = yield FfmpegWrapper.transcodeVideo('file', {
	//		setting1: 'something else',
	//		bitrate: 1200,
	//	});

	//	//app.highlight(actual);
	//},

}

// Export
export { FfmpegTest };
