ArchiveFile = File.extend({

	comment: null,

	getArchivedFileSystemObjectByPath: function*(archivedFileSystemObjectPath) {
		var list = yield this.list();

		var archivedFileSystemObject = null;

		list.each(function(index, zippedFileSystemObject) {
			//Console.out('Comparing', "\n", Terminal.style(archivedFileSystemObjectPath, 'red'), 'to', "\n", Terminal.style(zippedFileSystemObject.path, 'blue'));
			if(archivedFileSystemObjectPath == zippedFileSystemObject.path) {
				archivedFileSystemObject = zippedFileSystemObject;
				return false; // break
			}
		});

		return archivedFileSystemObject;
	},

	list: function*() {
		throw new Error('ArchiveFile.list() must be implemented by all classes that extend ArchiveFile.');
	},

});

// Static properties

// Archive modules must register their extensions
ArchiveFile.registeredImplementations = {};

// Static methods
ArchiveFile.registerImplementation = function(moduleName, extensions) {
	ArchiveFile.registeredImplementations[moduleName] = extensions;
}

ArchiveFile.constructFromPath = function(path) {
	var archiveFile = null;

	// Loop through all registered implementations
	ArchiveFile.registeredImplementations.each(function(moduleName, extensions) {
		// See if the path matches the current registered implentations extensions list
		extensions.each(function(extensionIndex, extension) {
			// Instantiate the appropriate archive file abstraction
			if(path.lowercase().endsWith(extension.lowercase())) {
				archiveFile = new global[moduleName+'File'](path);
				return false; // break
			}
		});

		if(archiveFile) {
			return false; // break;
		}
	});

	return archiveFile;
}