ArchiveFile = File.extend({

	archivedFileSystemObjects: null,

	comment: null,

	getArchivedFileSystemObjectByPath: function*(archivedFileSystemObjectPath) {
		var list = yield this.list();

		var archivedFileSystemObject = null;

		list.each(function(index, currentArchivedFileSystemObject) {
			//Console.out('Comparing', "\n", Terminal.style(archivedFileSystemObjectPath, 'red'), 'to', "\n", Terminal.style(currentArchivedFileSystemObject.path, 'blue'));
			if(archivedFileSystemObjectPath == currentArchivedFileSystemObject.path) {
				archivedFileSystemObject = currentArchivedFileSystemObject;
				return false; // break
			}
		});

		return archivedFileSystemObject;
	},

	list: function*() {
		if(!this.archivedFileSystemObjects) {
			// Get the 7-Zip list from the command line executable
			var sevenZipList = yield SevenZip.list(this.file);
			//Console.out(sevenZipList);

			this.archivedFileSystemObjects = [];

			// Create new ArchivedFileSystemObjects from the list
			sevenZipList.each(function(sevenZipArchivedFileSystemObjectPropertiesIndex, sevenZipArchivedFileSystemObjectProperties) {
				//Console.out('sevenZipArchivedFileSystemObjectProperties', sevenZipArchivedFileSystemObjectProperties);
				var archivedFileSystemObject = ArchivedFileSystemObject.constructFromSevenZipArchivedFileSystemObjectProperties(this, sevenZipArchivedFileSystemObjectProperties);
				this.archivedFileSystemObjects.append(archivedFileSystemObject);
			}.bind(this));
		}

		//Console.highlight('this.archivedFileSystemObjects', this.archivedFileSystemObjects);

		return this.archivedFileSystemObjects;
	},

});