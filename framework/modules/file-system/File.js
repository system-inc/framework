File = FileSystemObject.extend({

});

// Static methods
File.exists = Promise.promisify(NodeFileSystem.exists);
File.synchronous = {};
File.synchronous.exists = NodeFileSystem.existsSync;
File.synchronous.read = NodeFileSystem.readFileSync;