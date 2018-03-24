// Dependencies
import File from 'framework/system/file-system/File.js';
import SevenZip from 'framework/system/archive//libraries/7-zip/SevenZip.js';
import ArchivedFileSystemObject from 'framework/system/archive/file-system-objects/ArchivedFileSystemObject.js';

// Class
class ArchiveFile extends File {

	archivedFileSystemObjects = null;

	comment = null;

	async getArchivedFileSystemObjectByPath(archivedFileSystemObjectPath) {
		var list = await this.list();

		var archivedFileSystemObject = null;

		list.each(function(index, currentArchivedFileSystemObject) {
			//app.log('Comparing', "\n", Terminal.style(archivedFileSystemObjectPath, 'red'), 'to', "\n", Terminal.style(currentArchivedFileSystemObject.path, 'blue'));
			if(archivedFileSystemObjectPath == currentArchivedFileSystemObject.path) {
				archivedFileSystemObject = currentArchivedFileSystemObject;
				return false; // break
			}
		});

		return archivedFileSystemObject;
	}

	async list() {
		if(!this.archivedFileSystemObjects) {
			// Get the 7-Zip list from the command line executable
			var sevenZipList = await SevenZip.list(this.file);
			//app.log('sevenZipList', sevenZipList);

			this.archivedFileSystemObjects = [];

			// Create new ArchivedFileSystemObjects from the list
			await sevenZipList.each(async function(sevenZipArchivedFileSystemObjectPropertiesIndex, sevenZipArchivedFileSystemObjectProperties) {
				//app.log('sevenZipArchivedFileSystemObjectProperties', sevenZipArchivedFileSystemObjectProperties);
				var archivedFileSystemObject = await ArchivedFileSystemObject.createFromSevenZipArchivedFileSystemObjectProperties(this, sevenZipArchivedFileSystemObjectProperties);
				this.archivedFileSystemObjects.append(archivedFileSystemObject);
			}.bind(this));
		}

		//app.highlight('this.archivedFileSystemObjects', this.archivedFileSystemObjects);

		return this.archivedFileSystemObjects;
	}

}

// Export
export default ArchiveFile;
