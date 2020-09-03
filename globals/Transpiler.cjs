// Dependencies
const NodePath = require('path');
const NodeFileSystem = require('fs');
const NodeModule = require('module');
const BabelRegister = require('@babel/register');

// Class
class Transpiler {

	appScript = null;
	appPath = null;
	appScriptPath = null;
	frameworkPath = null;

	constructor(appScript, appPath, frameworkPath) {
		this.appScript = appScript;
		this.appPath = appPath;
		this.appScriptPath = NodePath.join(this.appPath, this.appScript);
		this.frameworkPath = frameworkPath;

		// Can use this to see the transpiled source code for any of the scripts
		// this.logCachedTranspiledSourceForPath(NodePath.join(this.frameworkPath, 'system/app/App.js'));

		this.monkeyPatchRequire();
		this.transpileRequiresAtRuntime();
		this.requireAppScript();
	}

	monkeyPatchRequire() {
		// We need to ignore the fact that the files we are requiring are ESM modules and
		// that package.json has type="module" set.
		// This is super hacky, I am ignoring the ESM check by redefining the function here:
		// https://github.com/nodejs/node/blob/master/lib/internal/modules/cjs/loader.js#L1099
		var standardModuleExtensionsJs = NodeModule._extensions['.js'];
		NodeModule._extensions['.js'] = function(module, filename) {
			const content = NodeFileSystem.readFileSync(filename, 'utf8');
			module._compile(content, filename);
		};

		// My imports use @framework and @app and a custom module loader
		// We can make this work with CJS by monkey patching _resolveFilename
		var standardResolveFilename = NodeModule._resolveFilename;
		NodeModule._resolveFilename = function(request, parentModule, isMain, options) {
			// Rewrite @framework and @app require paths
			if(request.startsWith('@framework')) {
				// console.log('incoming request', request);
				request = request.replace('@framework', this.frameworkPath);
				// console.log('new request', request);
			}
			else if(request.startsWith('@app')) {
				// console.log('incoming request', request);
				request = request.replace('@app', this.appPath);
				// console.log('new request', request);
			}
			
			return standardResolveFilename.call(this, request, parentModule, isMain, options)
		}.bind(this);
	}

	transpileRequiresAtRuntime() {
		// Integrate transpilation with require statements
		BabelRegister({
			plugins: [
				// Transform import to require
				'@babel/plugin-transform-modules-commonjs',
				// Allow class properties outside of the constructor
				'@babel/plugin-proposal-class-properties',
				// Support import.meta syntax
				'@babel/plugin-syntax-import-meta',
				// Transform import.meta for CJS
				'babel-plugin-transform-import-meta',
				// Allow import()
				'@babel/plugin-syntax-dynamic-import',
				'dynamic-import-node',
			],
			sourceMaps: 'both',
			ignore: [
				function(fileName) {
					// Ignore node_modules and sql.js
					if(fileName.match('node_modules') !== null || fileName.match('sql.js') !== null) {
						// console.log('Skipping transpilation on', fileName);
						return true;
					}
					else {
						// console.log('Transpiling', fileName);
						return false;
					}
				},
			],
			cache: true,
		});
	}

	requireAppScript() {
		// Require the app script
		require(this.appScriptPath);
	}

	logCachedTranspiledSourceForPath(path) {
		const TranspilerCache = require('@babel/register/lib/cache').get();
		// console.log('TranspilerCache', TranspilerCache);

		// Look through the cache for the transpiled script
		for(let key in TranspilerCache) {
			// The last 7 characters are not part of the JSON
			var keyObject = JSON.parse(key.substring(0, key.length - 7));
			
			if(keyObject.filename == path) {
				console.log(TranspilerCache[key].code);
				break;
			}
		}
	}

}

// Export
module.exports = Transpiler;
