FileSystem = function() {
}

FileSystem.list = Promise.promisify(NodeFileSystem.readdir);
FileSystem.lstat = Promise.promisify(NodeFileSystem.lstat);