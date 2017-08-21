// TODO: Clean this up

var Module = require('module').Module;
var nodePath = require('path');

var appModulePaths = [];
var old_nodeModulePaths = Module._nodeModulePaths;
var allowedDirectories = {};

function checkIfDirAllowed(from) {
    var currentDir = from;

    while (currentDir) {
        if (allowedDirectories[currentDir]) {
            return true;
        }

        var basename = nodePath.basename(currentDir);
        if (basename === 'node_modules') {
            return false;
        }

        var parentDir = nodePath.dirname(currentDir);
        if (parentDir === currentDir) {
            break;
        }
        currentDir = parentDir;
    }

    return true;
}

Module._nodeModulePaths = function(from) {
    var paths = old_nodeModulePaths.call(this, from);

    // Only include the app module path for top-level modules
    // that were not installed or that were explicitly allowed
    if (checkIfDirAllowed(from)) {
        paths = paths.concat(appModulePaths);
    }

    return paths;
};

function enableForDirectory(dir) {
    allowedDirectories[dir] = true;
}

function addRequirePath(path, parent) {
    // Anable app-module-path to work under any directories that are explicitly added
    enableForDirectory(path);

    function addRequirePathHelper(targetArray) {
        path = nodePath.normalize(path);
        if (targetArray && targetArray.indexOf(path) === -1) {
            targetArray.push(path);
        }
    }

    path = nodePath.normalize(path);

    if (appModulePaths.indexOf(path) === -1) {
        appModulePaths.push(path);
        // Enable the search path for the current top-level module
        if (require.main) {
            addRequirePathHelper(require.main.paths);
        }

        parent = parent || module.parent;

        // Also modify the paths of the module that was used to load the app-module-paths module
        // and all of it's parents
        while(parent && parent !== require.main) {
            addRequirePathHelper(parent.paths);
            parent = parent.parent;
        }
    }
}

exports.addRequirePath = addRequirePath;
exports.enableForDirectory = enableForDirectory;
