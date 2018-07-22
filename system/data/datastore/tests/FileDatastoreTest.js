// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import FileDatastore from 'framework/system/data/datastore/FileDatastore.js';

// Class
class FileDatastoreTest extends Test {

	/*
		Requirements

		1. Store data to a file in a multiprocess safe way
		2. Broadcast events when the data is changed (single process support for v1)

	*/

	async testCreateNewFileDatastore() {
		//console.log('FileDatastoreTest', app.directory);

		//var actual = 'Encode and decode me.';

		//actual = await Data.encode(actual, 'gzip');
		////app.log(actual.toString());
		//actual = await Data.decode(actual, 'gzip');
		////app.log(actual);

		//var expected = 'Encode and decode me.';

		//Assert.equal(actual, expected, 'gzip encode and decode a string');
	}

	async testReadExistingFileDatastore() {
	}

}

// Export
export default FileDatastoreTest;
