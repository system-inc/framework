FileSystemObject = Class.extend({

	name: null, // The name of the file (with extension) or directory
	path: null, // The full path to the file or directory, e.g., /directory/file.extension
	directory: null, // The directory containing the file system object
	size: null, // The size of the file system object in bytes
	mode: null,
	userId: null,
	groupId: null,
	blocks: null,
	blockSize: null,
	deviceId: null,
	specialDeviceId: null,
	indexNode: null,
	hardLinks: null,
	timeAccessed: null,
	timeModified: null,
	timeStatusChanged: null,
	nodeStatus: null,
	
	construct: function(path) {
		this.path = (path === undefined) ? this.path : path;

		// Make sure we have a path
		if(this.path) {
			// Figure out the name
			var name = this.path;
			if(this.path.endsWith(Node.Path.sep)) {
				name = name.replaceLast(Node.Path.sep, '');
			}
			this.name = name.substr(name.lastIndexOf(Node.Path.sep) + 1, name.length);

			// Figure out the directory
			this.directory = this.path.substr(0, this.path.lastIndexOf(Node.Path.sep) + 1);
		}
	},

	constructFromPath: function*(path) {
		// Make sure we have a path
		if(!path) {
			return false;
		}

		// Check to see if the file exists
		if(yield FileSystemObject.exists(path)) {
			// Get the file object status
			var nodeStatus = yield FileSystem.lstat(path);

			// Make sure to always be an instance of File or Directory
			if(nodeStatus.isFile()) {
				return new File(path);
			}
			else if(nodeStatus.isDirectory()) {
				return new Directory(path);
			}
		}

		return false;
	},

	initializeStatus: function*() {
		if(yield FileSystemObject.exists(this.path)) {
			// Get the file object status
			this.nodeStatus = yield FileSystem.stat(this.path);

			// Set the class variables
			this.size = this.nodeStatus.size;
			this.mode = this.nodeStatus.mode;
			this.userId = this.nodeStatus.uid;
			this.groupId = this.nodeStatus.gid;
			this.blocks = this.nodeStatus.blocks;
			this.blockSize = this.nodeStatus.blksize;
			this.deviceId = this.nodeStatus.dev;
			this.specialDeviceId = this.nodeStatus.rdev;
			this.indexNode = this.nodeStatus.ino;
			this.hardLinks = this.nodeStatus.nlink;
			this.timeAccessed = new Time(this.nodeStatus.atime);
			this.timeModified = new Time(this.nodeStatus.mtime);
			this.timeStatusChanged = new Time(this.nodeStatus.ctime);
		}
	},

	sizeInBits: function() {
		return this.size * 8;
	},

	sizeInBytes: function() {
		return this.size;
	},

	sizeInKilobytes: function() {
		return this.size / 1000;
	},

	sizeInKibibytes: function() {
		return this.size / 1024;
	},

	sizeInMegabytes: function() {
		return this.sizeInKilobytes() / 1000;
	},

	sizeInMebibytes: function() {
		return this.sizeInKibibytes() / 1024;
	},

	sizeInGigabytes: function() {
		return this.sizeInMegabytes() / 1000;
	},

	sizeInGigibytes: function() {
		return this.sizeInMebibytes() / 1024;
	},

	sizeInTerabytes: function() {
		return this.sizeInTerabytes() / 1000;
	},

	sizeInTebibytes: function() {
		return this.sizeInGigibytes() / 1024;
	},

	isFile: function() {
		return this.nodeStatus.isFile();
	},

	isDirectory: function() {
		return this.nodeStatus.isDirectory();
	},

	isBlockDevice: function() {
		return this.nodeStatus.isBlockDevice();
	},

	isCharacterDevice: function() {
		return this.nodeStatus.isCharacterDevice();
	},

	isSymbolicLink: function() {
		return this.nodeStatus.isSymbolicLink();
	},

	isFifo: function() {
		return this.nodeStatus.isFifo();
	},

	isSocket: function() {
		return this.nodeStatus.isSocket();
	},

	exists: Promise.method(function(fileSystemObject) {
	    return new Promise(function(resolve, reject) {
	    	Node.FileSystem.exists(fileSystemObject, function(exists) {
	    		//console.log(fileSystemObject, exists);
	    		resolve(exists);
	    	});
	    });
	}),
	
});

// Static methods
FileSystemObject.constructFromPath = FileSystemObject.prototype.constructFromPath;
FileSystemObject.exists = FileSystemObject.prototype.exists;