// This script runs the app script by using Babel to transpile the app
// at runtime to an older version of JavaScript which uses Common JS (CJS)
// requires and other transformations. This is necessary to run the app in
// Electron, which does not support ESM modules and will not for quite awhile:
// https://github.com/electron/electron/issues/21457#issuecomment-680600164
// See framework/app/index.js to see how the app runs without transpilation
let appScript = 'FrameworkApp.js';

// Dependencies
const NodePath = require('path');

// Set the paths
let appPath = __dirname;
// console.log('appPath', appPath);
let appScriptPath = NodePath.resolve(appPath, appScript);
// console.log('appScriptPath', appScriptPath);
let frameworkPath = NodePath.resolve(appPath, '../');
// console.log('frameworkPath', frameworkPath);

// Transpiler
let transpilerPath = NodePath.join(frameworkPath, 'globals/Transpiler.cjs');
// console.log('transpilerPath', transpilerPath);
const Transpiler = require(transpilerPath);
// console.log('Transpiler', Transpiler);

// Create the transpiler, which will run the app script
global.transpiler = new Transpiler(appScript, appPath, frameworkPath);
// console.log('transpiler', transpiler);
