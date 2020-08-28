// This script runs the app script in a child process with the correct arguments
// This allows users to conveniently use the command "node index.js" to run the app
// See framework/app/scripts/run.sh which does the same thing
var appScript = 'FrameworkApp.js';

// Dependencies
const NodePath = await import('path');
const NodeChildProcess = await import('child_process');

// Set the paths
var appPath = NodePath.dirname(import.meta.url.replace('file://', ''));
// console.log('appPath', appPath);
var appScriptPath = NodePath.resolve(appPath, appScript);
// console.log('appScriptPath', appScriptPath);
var frameworkPath = NodePath.resolve(appPath, '../');
// console.log('frameworkPath', frameworkPath);
var moduleLoaderScriptPath = NodePath.resolve(frameworkPath, 'globals/node/ModuleLoader.js');
// console.log('moduleLoaderScriptPath', moduleLoaderScriptPath);

// Execute the app's script, this is the same as ./scripts/run.sh
NodeChildProcess.spawn(
    'node',
    [
        '--no-warnings', // Do not show warnings
        '--experimental-json-modules', // Enable importing JSON
        '--experimental-loader', // Use a module loader
        moduleLoaderScriptPath,
        appScriptPath,
    ].concat(process.argv.slice(2)), // Pass arguments to the process
    {
        stdio: 'inherit', // Inherit standard input, output, and error
    },
);
