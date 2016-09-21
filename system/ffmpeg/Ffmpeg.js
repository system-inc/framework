// Class
var Ffmpeg = {}

// Static methods

Ffmpeg.execute = function*(input, argumentsArray) {
	// Keep track of the input type
	var inputType = null;

	// Set the input argument
	var inputArgument = null;

	// We will possibly use an input stream
	var inputStream = null;

	// If the input is a string, assume it is the file path
	if(String.is(input)) {
		//app.log('Ffmpeg.execute input is file path');
		inputType = 'file';
		inputArgument = input;
	}
	// If the input is a file object
	else if(Class.isInstance(input, File)) {
		//app.log('Ffmpeg.execute input is File object');
		inputType = 'file';
		inputArgument = input.file;
	}
	// If the input is an archived file system object
	else if(global['ArchivedFileSystemObject'] && Class.isInstance(input, ArchivedFileSystemObject)) {
		inputType = 'stream';
		inputArgument = 'pipe:0';
		inputStream = yield input.toReadStream();
	}
	// If the input is a stream
	else if(Stream.is(input)) {
		inputType = 'stream';
		inputArgument = 'pipe:0';
		inputStream = input;
	}

	// Use the module settings to know where the ffmpeg binary is
	var ffmpegFile = FfmpegModule.settings.get('file');

	// Create the arguments to invoke ffmpeg with
	var ffmpegArguments = [
		// Log level
		//'-loglevel',
		//'error',

		// Hardware acceleration
		'-hwaccel',
		'auto',
	];

	// Set the input format to jpeg_pipe if the input is a stream
	if(inputType == 'stream') {
		ffmpegArguments.append('-f');
		ffmpegArguments.append('jpeg_pipe');
	}

	// Set the input
	ffmpegArguments.append('-i');
	ffmpegArguments.append(inputArgument);

	// Add the user's arguments
	ffmpegArguments = ffmpegArguments.concat(argumentsArray);

	// Always output to standard out
	ffmpegArguments.push('pipe:1');

	// Log the ffmpeg file and arguments
	//app.log('ffmpegFile', ffmpegFile, 'ffmpegArguments', ffmpegArguments);

	// Spawn ffmpeg as a new child process
	var ffmpegChildProcess = Node.ChildProcess.spawn(ffmpegFile, ffmpegArguments, {
		detached: false,
	});

	// If input is a stream, pipe the stream to ffmpeg using standard in
	if(inputStream) {
		inputStream.pipe(ffmpegChildProcess.stdin);
	}

	// When data is sent to standard in
	ffmpegChildProcess.stdin.on('data', function(data) {
		//app.log('ffmpeg standard in data', data);
		//app.log('ffmpeg standard in data');
	});

	// When standard in has an error
	ffmpegChildProcess.stdin.on('error', function(data) {
		//app.log('ffmpeg standard in error', data);
	});

	// When data is sent to standard out
	ffmpegChildProcess.stdout.on('data', function(data) {
		//app.log('ffmpeg standard out', data);
		//app.log('ffmpeg standard out data');
	});

	// When standard out has an error
	ffmpegChildProcess.stdout.on('error', function(data) {
		//app.log('ffmpeg standard out error', data);
	});

	// When data is sent to standard error
	ffmpegChildProcess.stderr.on('data', function(data) {
		//app.error('ffmpeg standard error', data);
	});

	// When ffmpeg exits
	ffmpegChildProcess.on('exit', function(code) {
		//app.log('ffmpeg terminated with code', code);
	});

	// When ffmpeg has an error
	ffmpegChildProcess.on('error', function(error) {
		//app.error('ffmpeg error', error);
	});

	// We always send processed data from ffmpeg to standard out
	return ffmpegChildProcess.stdout;
}.toPromise();

Ffmpeg.resizeImage = function*(input, width, height) {
	// -1 will use automatically aspect ratio
	if(!width) {
		width = -1;
	}
	if(!height) {
		height = -1;
	}

	var ffmpegStandardOutStream = yield Ffmpeg.execute(input, [
		// Scale
		'-vf',
		'scale='+width+':'+height,

		// Output format
		'-f',
		'image2pipe',
	]);

	return ffmpegStandardOutStream;
}.toPromise();

Ffmpeg.imageFromVideoAtPosition = function*(input, position, width, height) {
	// -1 will use automatically aspect ratio
	if(!width) {
		width = -1;
	}
	if(!height) {
		height = -1;
	}

	var ffmpegStandardOutStream = yield Ffmpeg.execute(input, [
		// Scale
		'-vf',
		'scale='+width+':'+height,

		// Position in the video file
		'-ss',
		position, //'00:00:05.000',

		// The number of video frames to output
		'-vframes',
		'1',

		// The frame rte
		'-r',
		'1',

		// Output format
		'-f',
		'image2pipe',
	]);

	return ffmpegStandardOutStream;
}.toPromise();

// TRANSCODE


//var child_process = require('child_process'),
//	http = require('http');
//	url = require('url'),
//	ffmpeg = null;
    
//var livestream = function (req, resp) {
//    // For live streaming, create a fragmented MP4 file with empty moov (no seeking possible).
//	//var input = 'udp://225.1.1.1:8208';
//    var input = 'trans.mp4';

//    app.log("Input: " + input, ffmpeg)

//    resp.writeHead(200, {
//        //'Transfer-Encoding': 'binary'
//          "Connection": "keep-alive"
//        , "Content-Type": "video/mp4"
//        //, 'Content-Length': chunksize            // ends after all bytes delivered
//        , "Accept-Ranges": "bytes"                 // Helps Chrome
//    });

//   if (!ffmpeg) {
//		ffmpeg = child_process.spawn("ffmpeg", [
//			"-i", input, "-vcodec", "copy", "-f", "mp4", "-movflags", "frag_keyframe+empty_moov", 
//			"-reset_timestamps", "1", "-vsync", "1","-flags", "global_header", "-bsf:v", "dump_extra", "-y", "-"   // output to stdout
//			],  {detached: false});

//		ffmpeg.stdout.pipe(resp);

//		ffmpeg.stdout.on("data",function(data) {
//			app.log("Data");
//		});

//		ffmpeg.stderr.on("data", function (data) {
//			app.log("Error -> " + data);
//		});

//		ffmpeg.on("exit", function (code) {
//			app.log("ffmpeg terminated with code " + code);
//		});

//		ffmpeg.on("error", function (e) {
//			app.log("ffmpeg system error: " + e);
//		});
//   }
   
//    req.on("close", function () {
//        shut("closed")
//    })
    
//    req.on("end", function () {
//        shut("ended")
//    });

//    function shut(event) {
//        //TODO: Stream is only shut when the browser has exited, so switching screens in the client app does not kill the session
//        app.log("Live streaming connection to client has " + event)
//        if (ffmpeg) {
//            ffmpeg.kill();
//			ffmpeg = null;
//        }
//    }
//    return true
//}

//var http_server = http.createServer(livestream).listen(9090, function () {
//	app.log("Server listening on port 9090");
//});

// Export
module.exports = Ffmpeg;