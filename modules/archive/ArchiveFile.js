// Dependencies
var File = Framework.require('modules/file-system/File.js');
var SevenZip = Framework.require('modules/archive/libraries/7-zip/SevenZip.js');
var ArchivedFileSystemObjectFactory = Framework.require('modules/archive/file-system-objects/ArchivedFileSystemObjectFactory.js');

// Class
var ArchiveFile = File.extend({

	archivedFileSystemObjects: null,

	comment: null,

	getArchivedFileSystemObjectByPath: function*(archivedFileSystemObjectPath) {
		var list = yield this.list();

		var archivedFileSystemObject = null;

		list.each(function(index, currentArchivedFileSystemObject) {
			//Console.log('Comparing', "\n", Terminal.style(archivedFileSystemObjectPath, 'red'), 'to', "\n", Terminal.style(currentArchivedFileSystemObject.path, 'blue'));
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
			//Console.log(sevenZipList);

			this.archivedFileSystemObjects = [];

			// Create new ArchivedFileSystemObjects from the list
			sevenZipList.each(function(sevenZipArchivedFileSystemObjectPropertiesIndex, sevenZipArchivedFileSystemObjectProperties) {
				//Console.log('sevenZipArchivedFileSystemObjectProperties', sevenZipArchivedFileSystemObjectProperties);
				var archivedFileSystemObject = ArchivedFileSystemObjectFactory.createFromSevenZipArchivedFileSystemObjectProperties(this, sevenZipArchivedFileSystemObjectProperties);
				this.archivedFileSystemObjects.append(archivedFileSystemObject);
			}.bind(this));
		}

		//Console.highlight('this.archivedFileSystemObjects', this.archivedFileSystemObjects);

		return this.archivedFileSystemObjects;
	},

});

// Export
module.exports = ArchiveFile;