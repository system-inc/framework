// Dependencies
import Directory from 'system/file-system/Directory.js';

// Class
class ElectronManager {

	static async getPathToElectronExecutable() {
		var pathToElectronExecutable = null;

		// Get the electron
		var nodeModuleLookupPaths = Node.Module._resolveLookupPaths('electron')[1];
		var pathToElectronModule = null;
		//app.log('nodeModuleLookupPaths', nodeModuleLookupPaths);

		await nodeModuleLookupPaths.each(async function(index, lookupPath) {
			var reformedLookupPath = lookupPath;
			//app.log('reformedLookupPath', reformedLookupPath);
			if(reformedLookupPath.endsWith('node')) {
				reformedLookupPath = reformedLookupPath.replaceLast('node', 'node_modules');
			}

			reformedLookupPath = Node.Path.join(reformedLookupPath, 'electron');

			if(await Directory.exists(reformedLookupPath)) {
				pathToElectronModule = reformedLookupPath;
				return false; // break
			}
		});

		//app.info('pathToElectronModule', pathToElectronModule);

		if(pathToElectronModule) {
			pathToElectronExecutable = require(pathToElectronModule);
			//app.log('pathToElectronExecutable', pathToElectronExecutable);
		}

		return pathToElectronExecutable;
	}

}

// Export
export default ElectronManager;
