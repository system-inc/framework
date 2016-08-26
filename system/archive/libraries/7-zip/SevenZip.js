// Dependencies
var ArchiveModule = app.modules.archiveModule;

// Class
class SevenZip {

	async execute(argumentsArray) {
		// Locate the 7-Zip executable
		var sevenZipExecutable = null;

		// If the ArchiveModule exists
		if(ArchiveModule) {
			sevenZipExecutable = ArchiveModule.settings.get('sevenZip.executable');
		}

		if(!sevenZipExecutable) {
			throw new Error('7-Zip executable not found. Configure your settings.json to use the "archive" module.');
		}

		// Create the arguments to invoke 7-Zip with
		var sevenZipArguments = [
			'-so', // Always output to standard out
		];

		// Merge with the user's arguments
		sevenZipArguments = sevenZipArguments.merge(argumentsArray);

		// Log the executable and arguments
		//Console.log('sevenZipExecutable', sevenZipExecutable, 'sevenZipArguments', sevenZipArguments);

		// Spawn 7-Zip as a new child process
		var sevenZipChildProcess = Node.ChildProcess.spawn(sevenZipExecutable, sevenZipArguments, {
			detached: false,
		});

		// When data is sent to standard in
		sevenZipChildProcess.stdin.on('data', function(data) {
			//Console.log('7-Zip standard in data');
		});

		// When standard in has an error
		sevenZipChildProcess.stdin.on('error', function(data) {
			//Console.log('7-Zip standard in error', data);
		});

		// When data is sent to standard out
		sevenZipChildProcess.stdout.on('data', function(data) {
			//Console.log('7-Zip standard out', data);
			//Console.log('7-Zip standard out data');
		});

		// When standard out has an error
		sevenZipChildProcess.stdout.on('error', function(data) {
			//Console.log('7-Zip standard out error', data);
		});

		// When data is sent to standard error
		sevenZipChildProcess.stderr.on('data', function(data) {
			//Console.error('7-Zip standard error', data);
		});

		// When 7-Zip exits
		sevenZipChildProcess.on('exit', function(code) {
			//Console.log('7-Zip terminated with code', code);
		});

		// When 7-Zip has an error
		sevenZipChildProcess.on('error', function(error) {
			//Console.error('7-Zip error', error);
		});

		// We always send processed data from 7-Zip to standard out
		return sevenZipChildProcess.stdout;
	}

	async extract(source, archivedFileSystemObjectPath) {
		var readStream = await SevenZip.execute([
			'e', // extract
			source.file, // archive file
			archivedFileSystemObjectPath, // the file to extract
		]);

		return readStream;
	}

	async list(source) {
		var list = [];

		var listStream = await SevenZip.execute([
			'l', // list
			'-slt', // Show technical information for list
			source,
		]);

		// Outputs data that looks like this:
		/*
		Listing archive: c:\framework\modules\archive\tests\files\zip-file-with-comment.zip

		--
		Path = c:\framework\modules\archive\tests\files\zip-file-with-comment.zip
		Type = zip
		Physical Size = 416
		Comment = This is a multi-line comment.

		Good luck!

		End of comment.

		----------
		Path = folder
		Folder = +
		Size = 0
		Packed Size = 0
		Modified = 2015-07-09 22:42:25
		Created = 2015-07-09 22:42:25
		Accessed = 2015-07-09 22:42:25
		Attributes = D
		Encrypted = -
		Comment =
		CRC =
		Method = Store
		Host OS = FAT
		Version = 10

		Path = folder\file.txt
		Folder = -
		Size = 65
		Packed Size = 64
		Modified = 2015-07-09 22:42:41
		Created = 2015-07-09 22:42:21
		Accessed = 2015-07-09 22:42:21
		Attributes = A
		Encrypted = -
		Comment =
		CRC = D59D6865
		Method = Deflate
		Host OS = FAT
		Version = 20
		*/

		var listString = await listStream.toString();
		//Console.highlight('listString', listString);

		// This marks where the archived file system objects start getting printed out
		var archivedFileSystemObjectsDelimiter = '----------';

		var indexOfArchivedFileSystemObjectsDelimiter = listString.indexOf(archivedFileSystemObjectsDelimiter);
		//Console.log(indexOfArchivedFileSystemObjectsDelimiter);

		//var archiveFileString = listString.substring(0, indexOfArchivedFileSystemObjectsDelimiter + archivedFileSystemObjectsDelimiter.length).trim();
		//Console.log('archiveFileString', archiveFileString);
		//var archiveFile = SevenZip.parseArchiveFileString(archiveFileString);
		//Console.log('archiveFile', archiveFile);

		var archivedFileSystemObjectsString = listString.substring(indexOfArchivedFileSystemObjectsDelimiter + archivedFileSystemObjectsDelimiter.length).trim();
		//Console.log('archivedFileSystemObjectsString', archivedFileSystemObjectsString);

		var archivedFileSystemObjectsStringArray = archivedFileSystemObjectsString.split('Path = ');
		archivedFileSystemObjectsStringArray = archivedFileSystemObjectsStringArray.delete(0);
		//Console.log('archivedFileSystemObjectsStringArray', archivedFileSystemObjectsStringArray);

		archivedFileSystemObjectsStringArray.each(function(index, archivedFileSystemObjectString) {
			//Console.log('archivedFileSystemObjectString', archivedFileSystemObjectString);

			// Parse the string
			var archivedFileSystemObjectProperties = SevenZip.parseArchivedFileSystemObjectString(archivedFileSystemObjectString);

			// Add the properties to the list
			list.append(archivedFileSystemObjectProperties);
		});

		//Console.highlight('list', list);

		return list;
	}

	parseArchiveFileString(archiveFileString) {
		var archiveFileProperties = {
			type: null,
			size: null,
			comment: null,
		};

		archiveFileProperties.type = archiveFileString.match(/.*Type\s=\s(.*)?\s/).second();
		archiveFileProperties.size = archiveFileString.match(/.*Physical\sSize\s=\s(.*)?\s/).second();
		archiveFileProperties.comment = archiveFileString.match(/.*Comment\s=\s((.|[\r\n])*)?----------/).second().trim();

		return archiveFileProperties;
	}

	parseArchivedFileSystemObjectString(archivedFileSystemObjectString) {
		//Console.highlight('archivedFileSystemObjectString', archivedFileSystemObjectString);

		var archivedFileSystemObjectProperties = {
			path: null,
			folder: null,
			size: null,
			packedSize: null,
			modified: null,
			created: null,
			accessed: null,
			attributes: null,
			encrypted: null,
			comment: null,
			crc: null,
			method: null,
			hostOperatingSystem: null,
			version: null,
		};

		archivedFileSystemObjectProperties.path = archivedFileSystemObjectString.match(/(.*)?\s/).second();
		archivedFileSystemObjectProperties.folder = archivedFileSystemObjectString.match(/.*Folder\s=\s(.*)?\s/).second();
		archivedFileSystemObjectProperties.size = archivedFileSystemObjectString.match(/.*Size\s=\s(.*)?\s/).second();
		archivedFileSystemObjectProperties.packedSize = archivedFileSystemObjectString.match(/.*Packed\sSize\s=\s(.*)?\s/).second();
		archivedFileSystemObjectProperties.modified = archivedFileSystemObjectString.match(/.*Modified\s=\s(.*)?\s/).second();
		archivedFileSystemObjectProperties.created = archivedFileSystemObjectString.match(/.*Created\s=\s(.*)?\s/).second();
		archivedFileSystemObjectProperties.accessed = archivedFileSystemObjectString.match(/.*Accessed\s=\s(.*)?\s/).second();
		archivedFileSystemObjectProperties.attributes = archivedFileSystemObjectString.match(/.*Attributes\s=\s(.*)?\s/).second();
		archivedFileSystemObjectProperties.encrypted = archivedFileSystemObjectString.match(/.*Encrypted\s=\s(.*)?\s/).second();

		var commentMatches = archivedFileSystemObjectString.match(/.*Comment\s=\s(.*)?\s/);
		//Console.highlight('commentMatches', commentMatches);
		if(commentMatches && commentMatches.second()) {
			archivedFileSystemObjectProperties.comment = commentMatches.second();
		}

		archivedFileSystemObjectProperties.crc = archivedFileSystemObjectString.match(/.*CRC\s=\s(.*)?\s/).second();
		archivedFileSystemObjectProperties.method = archivedFileSystemObjectString.match(/.*Method\s=\s(.*)?\s/).second();
		archivedFileSystemObjectProperties.hostOperatingSystem = archivedFileSystemObjectString.match(/.*Host\sOS\s=\s(.*)?\s/).second();

		var versionMatches = archivedFileSystemObjectString.match(/.*Version\s=\s(.*)/);
		//Console.highlight('versionMatches', versionMatches);
		if(versionMatches && versionMatches.second()) {
			archivedFileSystemObjectProperties.version = versionMatches.second();	
		}	

		return archivedFileSystemObjectProperties;
	}

}

// Export
export default SevenZip;
