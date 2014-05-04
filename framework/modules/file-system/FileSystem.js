require('./FileSystemObject');
require('./Directory');
require('./File');

FileSystem = function() {
}

FileSystem.list = Promise.promisify(NodeFileSystem.readdir);
FileSystem.lstat = Promise.promisify(NodeFileSystem.lstat);