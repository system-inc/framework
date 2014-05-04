FileSystemObject = Class.extend({

	construct: function(path) {
		this.path = (path === undefined) ? null : path;

		// Make sure we have a path
		if(!path) {
			return false;
		}

		// Populate class variables from status
		this.initializeStatus();
	},

	constructFromPath: function*(path) {
		// Make sure we have a path
		if(!path) {
			return false;
		}

		// Get the file object status
		var nodeStatus = yield FileSystem.lstat(path);

		// Make sure to always be an instance of File or Directory
		if(nodeStatus.isFile()) {
			return new File(path);
		}
		else if(nodeStatus.isDirectory()) {
			return new Directory(path);
		}
	},

	initializeStatus: function() {
		// Get the file object status MAKE THIS ASYNC
		this.nodeStatus = NodeFileSystem.lstatSync(this.path);

		// Set the class variables
		this.sizeInBytes = this.nodeStatus.size;
		this.mode = this.nodeStatus.mode;
		this.userId = this.nodeStatus.uid;
		this.groupId = this.nodeStatus.gid;
		this.blocks = this.nodeStatus.blocks;
		this.blockSize = this.nodeStatus.blksize;
		this.deviceId = this.nodeStatus.dev;
		this.specialDeviceId = this.nodeStatus.rdev;
		this.indexNode = this.nodeStatus.ino;
		this.hardLinks = this.nodeStatus.nlink;
		this.accessed = new Time(this.nodeStatus.atime);
		this.modified = new Time(this.nodeStatus.mtime);
		this.statusChanged = new Time(this.nodeStatus.ctime);
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
	
});

// Static methods
FileSystemObject.constructFromPath = FileSystemObject.prototype.constructFromPath;