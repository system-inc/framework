// Dependencies
import NodePath from 'path';

// Class
class ModuleLoader {

    moduleAliases = {};

    constructor() {
        // The ModuleLoader is in the Framework directory        
        var moduleLoaderClassPath = import.meta.url; // file://.../framework/globals/node/ModuleLoader.js
        moduleLoaderClassPath = moduleLoaderClassPath.replace('file://', ''); // .../framework/globals/node/ModuleLoader.js
        moduleLoaderClassPath = NodePath.dirname(moduleLoaderClassPath); // .../framework/globals/node
        //console.log('moduleLoaderClassPath', moduleLoaderClassPath);

        // Set the Framework path alias
        var frameworkPath = NodePath.resolve(moduleLoaderClassPath, '../../'); // Derive the Framework directory from the ModuleLoader.js directory
        //console.log('frameworkPath', frameworkPath);
        this.moduleAliases['@framework'] = frameworkPath;

        // Get the app script path from the process command line arguments
        //console.log('process.argv', process.argv);
        var appScriptPath = process.argv[1]; // Argument 0 is the path to node, argument 1 is the path to the script
        //console.log('appScriptPath', appScriptPath);
        
        // The App directory is the current working directory of the process
        var appPath = NodePath.dirname(appScriptPath);
        //console.log('appPath', appPath);
        this.moduleAliases['@app'] = appPath;
    }

    async resolve(specifier, context, defaultResolve) {
        //console.log('specifier', specifier, 'context', context);

        // Process module aliases
        for(let moduleAlias in this.moduleAliases) {
            if(specifier.indexOf(moduleAlias) === 0) {
                // Replace the @alias with the file path
                specifier = 'file://'+specifier.replace(moduleAlias, this.moduleAliases[moduleAlias]);
                //console.log('Remapped import to', specifier);
                break;
            }
        }

        return defaultResolve(specifier, context, defaultResolve);
    }

}

// Create the module loader
var moduleLoader = new ModuleLoader();

// Export the resolve method
export let resolve = moduleLoader.resolve.bind(moduleLoader);
