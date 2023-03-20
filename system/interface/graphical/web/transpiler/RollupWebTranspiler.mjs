// Dependencies
import RollupPluginAlias from '@rollup/plugin-alias';
import RollupPluginJson from '@rollup/plugin-json';
import RollupPluginDynamicImportVarsImport from '@rollup/plugin-dynamic-import-vars';
import RollupPluginBabelImport from '@rollup/plugin-babel';
import MagicString from 'magic-string';
import EsTreeWalker from 'estree-walker';
import NodePath from 'path';
import NodeFileSystem from 'fs';

// Handle plugins exporting default and not being compatible with the latest modules
const RollupPluginDynamicImportVars = RollupPluginDynamicImportVarsImport.default;
const RollupPluginBabel = RollupPluginBabelImport.default;

// Class
class RollupWebTranspiler {

    scriptsToStripMethodsFrom = {
        'framework/globals/standard/errors/Error.js': [
            'prepareStackTrace',
        ],
        'framework/system/app/App.js': [
            'initializeNodeEnvironmentSettings',
            'initializeNodeEnvironment',
            'initializeProcess',
            'configureStandardStreams',
            'configureStandardStreamsFileLog',
            'configureCommandLineInterface',
            'initializeCommandLineInterface',
            'configureInteractiveCommandLineInterface',
            'importAndInitializeModules',
            'initializeMainProcessEnvironment',
            'initializeChildProcessEnvironment',
            'getUserPath',
            'getUserDesktopPath',
            'formatLogData',
            'formatLogDataWithMetaDataPrefix',
            'formatLogDataWithoutMetaDataPrefix',
        ],
        'framework/system/settings/Settings.js': [
            'integrateFromFile',
            'fromFile',
        ],
    };

    // External modules which will not be included
    importSpecifiersToIgnore = [
        // Framework imports which are node specific and not for the web
        '@framework/globals/NodeGlobals.js',
        '@framework/globals/standard/errors/StackTrace.js',

        //'source-map-support', // Used for stack traces at framework/globals/standard/errors/CallSite.js

        // Node
        'assert',
        'child_process',
        'cluster',
        'crypto',
        'events',
        'fs',
        'http',
        'https',
        'http2',
        'module',
        'net',
        'os',
        'path',
        'readline',
        'stream',
        'url',
        'util',
        'zlib',

        // node_modules - Firebase
        'source-map-support',
        'source-map-support/register', // Used for source maps for Firebase Functions
        'firebase-functions',
        'firebase-admin',

        // node_modules - Google Cloud
        '@google-cloud/storage',
        '@google-cloud/text-to-speech',

        // node_modules
        'express',
        'busboy',
        'bent',
        'moment',
    ];

    importSpecifiersToIgnoreGlobalVariables = {};

    // Rollup plugins
    rollupPluginJson = null;
    rollupPluginDynamicImportVars = null;
    rollupPluginAlias = null;
    rollupPluginBabel = null;
    rollupPluginFramework = null;

    // Build options
    buildTarget = null; // node or web
    environment = null; // development or production

    // Paths
    appPath = null;
    frameworkPath = null;

    initialize(buildTarget = 'node', environment = 'development', frameworkPath, appPath) {
        this.buildTarget = buildTarget;
        this.environment = environment;
        this.frameworkPath = frameworkPath;
        this.appPath = appPath;

        // console.log('this.buildTarget', this.buildTarget);
        // console.log('this.environment', this.environment);
        // console.log('this.frameworkPath', this.frameworkPath);
        // console.log('this.appPath', this.appPath);
        
        // // We assume the current working directory is ..../(app directory)/scripts/
        // this.appPath = Path.resolve('./../'); // Jump back one directory to the app path
        // //console.log('this.appPath', this.appPath);

        // // Derive the Framework path from this file's path
        // this.frameworkPath = import.meta.url; // file://.../framework/system/interface/graphical/web/transpiler/RollupWebTranspiler.js
        // this.frameworkPath = this.frameworkPath.replace('file://', ''); // .../framework/system/interface/graphical/web/transpiler/RollupWebTranspiler.js
        // this.frameworkPath = Path.dirname(this.frameworkPath); // .../framework/system/interface/graphical/web/transpiler
        // this.frameworkPath = Path.resolve(this.frameworkPath, '../../../../../'); // .../framework
        // //console.log('this.frameworkPath', this.frameworkPath);

        this.initializeRollupPlugins();

        // Hacky way to have the browser ignore server-side modules by pointing them at an empty object
        for(var i = 0; i < this.importSpecifiersToIgnore.length; i++) {
            this.importSpecifiersToIgnoreGlobalVariables[this.importSpecifiersToIgnore[i]] = '{}';
        }
    }

    initializeRollupPlugins() {
        //console.log('this', this);

        // Aliases for @framework and @app
        this.rollupPluginAlias = RollupPluginAlias({
            entries: [
                {
                    find: '@app',
                    replacement: this.appPath,
                },
                {
                    find: '@framework',
                    replacement: this.frameworkPath,
                },
            ],
        });

        // JSON
        this.rollupPluginJson = RollupPluginJson();

        // import(variable) support
        this.rollupPluginDynamicImportVars = RollupPluginDynamicImportVars();

        // Babel
        this.rollupPluginBabel = RollupPluginBabel({
            babelHelpers: 'bundled',
            plugins: [
                '@babel/plugin-proposal-class-properties', // Need this for mobile Safari and Chrome
            ],
            sourceMaps: 'both', // Generate source maps
            comments: (this.environment == 'development'),
            compact: (this.environment == 'production'),
            minified: (this.environment == 'production'),
        });

        // Web build target
        if(this.buildTarget == 'web' || this.buildTarget == 'cloudflareWorker') {
            // Framework
            this.rollupPluginFramework = this.createRollupPluginFramework();
        }
    }

    createRollupPluginFramework() {
        var rollupWebTranspilerContext = this;

        // A source map is included if we are in development environment
        var includeSourceMap = false;
        if(this.environment == 'development') {
            includeSourceMap = true;
        }

        return {
            name: 'framework', // This name will show up in warnings and errors
            transform(code, id) {
                // For performance, only run transformation specific files
                var currentFrameworkClassToStripMethodsFrom = null;
                for(let frameworkClassToStripMethodsFrom in rollupWebTranspilerContext.scriptsToStripMethodsFrom) {
                    if(id.endsWith(frameworkClassToStripMethodsFrom)) {
                        currentFrameworkClassToStripMethodsFrom = frameworkClassToStripMethodsFrom;
                        break;
                    }
                }
                if(currentFrameworkClassToStripMethodsFrom == null) {
                    //console.log('Skipping', id);
                    return null;
                }
        
                //console.log('Rollup Plugin Framework - Transforming:', id);
        
                // Keep track if we changed any code
                var codeChanged = false;
                
                // Create an AST
                let ast = null;
                try {
                    ast = this.parse(code);
                }
                catch(error) {
                    error.message += ` in ${id}`;
                    throw err;
                }

                // Create a magic string from the code
                const magicString = new MagicString(code);
        
                function getName(node) {
                    if(node.type === 'Identifier') {
                        return node.name;
                    }
                    if(node.type === 'ThisExpression') {
                        return 'this';
                    }
                    if(node.type === 'Super') {
                        return 'super';
                    }
                    return null;
                }
        
                function flatten(node) {
                    const parts = [];
                    while(node.type === 'MemberExpression') {
                        if(node.computed) {
                            return null;
                        }
                        parts.unshift(node.property.name);
                        node = node.object;
                    }
                    const name = getName(node);
                    if(!name) {
                        return null;
                    }
                    parts.unshift(name);
                    return parts.join('.');
                }
        
                function isBlock(node) {
                    return node && (node.type === 'BlockStatement' || node.type === 'Program');
                }
        
                function remove(start, end) {
                    // Remove Whitespace
                    while(/\s/.test(code[start - 1])) {
                        start -= 1;
                    }
                    magicString.remove(start, end);
                }
        
                function removeMethodDefinition(node) {
                    remove(node.start, node.end);
                    codeChanged = true;
                }
        
                function removeStatement(node) {
                    const { parent } = node;
                    if(isBlock(parent)) {
                        remove(node.start, node.end);
                    }
                    else {
                        magicString.overwrite(node.start, node.end, '(void 0);');
                    }
                    codeChanged = true;
                }
        
                function removeCallExpression(node) {
                    const { parent } = node;
                    if(parent.type === 'ExpressionStatement') {
                        removeStatement(parent);
                    }
                    else {
                        magicString.overwrite(node.start, node.end, '(void 0)');
                    }
                    codeChanged = true;
                }
        
                // Walk the AST tree
                // Use this tool to see what's going on: https://astexplorer.net/
                EsTreeWalker.walk(
                    ast,
                    {
                        enter(node, parent) {
                            // Define the parent on entry
                            Object.defineProperty(
                                node,
                                'parent',
                                {
                                    value: parent,
                                    enumerable: false,
                                    configurable: true,
                                },
                            );
        
                            // If source maps are used update them
                            if(includeSourceMap) {
                                magicString.addSourcemapLocation(node.start);
                                magicString.addSourcemapLocation(node.end);
                            }
                            
                            //console.log('node.type', node.type, 'node.key.name', node.key);
                            
                            // Remove Node specific ClassMethods
                            if(node.type === 'MethodDefinition') {
                                var methodName = node.key.name;
                                //console.log('MethodDefinition', node.key.name);
                                
                                // If we should remove the method definition
                                if(
                                    methodName !== 'constructor' &&
                                    methodName !== 'toString' &&
                                    rollupWebTranspilerContext.scriptsToStripMethodsFrom[currentFrameworkClassToStripMethodsFrom].includes(methodName)) {
                                    //console.log('Removing method definition', methodName, 'from', id);
                                    removeMethodDefinition(node);
                                    this.skip();
                                }
                            }
                            // Catch assignments outside of classes, such as Error.prepareStackTrace = function()
                            else if(node.type === 'ExpressionStatement') {
                                if(
                                    node.expression.type == 'AssignmentExpression' &&
                                    node.expression.left.type == 'MemberExpression' &&
                                    rollupWebTranspilerContext.scriptsToStripMethodsFrom[currentFrameworkClassToStripMethodsFrom].includes(node.expression.left.property.name)
                                ) {
                                    //console.log('Removing method definition', node.expression.left.property.name, 'from', id);
                                    removeMethodDefinition(node);
                                    this.skip();
                                }
                            }
                            // // Remove logging (console.log, etc.)
                            // else if(node.type === 'CallExpression') {
                            //     const keyPath = flatten(node.callee);
                            //     //console.log('CallExpression', keyPath);
            
                            //     // If we should remove the call expression
                            //     if(callExpressionsToRemove[keyPath]) {
                            //         console.log('Removing call expression', keyPath, 'from', id);
                            //         removeCallExpression(node);
                            //         this.skip();
                            //     }
                            // }
                            // // Remove debugger statements
                            // // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger
                            // else if(node.type === 'DebuggerStatement') {
                            //     removeStatement(node);
                            //     this.skip();
                            // }
                        }
                    },
                );
        
                // If no change has happened
                if(!codeChanged) {
                    return null;
                }
        
                // If we changed the code, return the change
                code = magicString.toString();
                const map = includeSourceMap ? magicString.generateMap() : null;
                return {
                    code,
                    map,
                };
            }
        };
    }

    onRollupWarning(warning, warn) {
        var skipRollupWarning = false;

        // Skip eval warnings on Json.js
        if(warning.code === 'EVAL' && warning.id.endsWith('Json.js')) {
            skipRollupWarning = true;
        }
        // Skip warnings on imports which we know we don't want to use
        else if(warning.code === 'UNUSED_EXTERNAL_IMPORT' && this.importSpecifiersToIgnore.includes(warning.source)) {
            skipRollupWarning = true;            
        }
    
        // Use default for everything else
        if(!skipRollupWarning) {
            warn(warning);
        }
    }

    async getRollupConfiguration(commandLineArguments) {
        //console.log('commandLineArguments', commandLineArguments);
        //process.exit();

        // Check the app path for rollup-web-transpiler
        var appSpecificSettingsPath = NodePath.resolve(commandLineArguments.configurationAppPath, 'settings', 'rollup-web-transpiler.js');
        //console.log('appSpecificSettingsPath', appSpecificSettingsPath);

        // If the app specific settings exist, import them
        if(NodeFileSystem.existsSync(appSpecificSettingsPath)) {
            let { settings } = await import(appSpecificSettingsPath);

            // Merge scriptsToStripMethodsFrom
            if(settings.scriptsToStripMethodsFrom) {
                this.scriptsToStripMethodsFrom = {...this.scriptsToStripMethodsFrom, ...settings.scriptsToStripMethodsFrom }
            }
            //console.log('this', this);
        }
        //process.exit();

        this.initialize(
            commandLineArguments.configurationBuildTarget,
            commandLineArguments.configurationEnvironment,
            commandLineArguments.configurationFrameworkPath,
            commandLineArguments.configurationAppPath,
        );
        //console.log(this); process.exit();

        // Default node build target
        var format = 'cjs';
        var globals = null;
        var external = this.importSpecifiersToIgnore;
        var plugins = [
            this.rollupPluginJson,
            this.rollupPluginDynamicImportVars,
            this.rollupPluginAlias,
            this.rollupPluginBabel,
        ];

        // If the build target is for the web
        if(this.buildTarget == 'web') {
            format = 'iife';

            // We ignore node specific import() calls
            globals = this.importSpecifiersToIgnoreGlobalVariables;
            plugins.unshift(this.rollupPluginFramework);
        }
        // If the build target is for Cloudflare Workers
        else if(this.buildTarget == 'cloudflareWorker') {
            console.log('cloudflareWorker!!!!!!!!');
            format = 'es';

            // We ignore node specific import() calls
            globals = this.importSpecifiersToIgnoreGlobalVariables;
            plugins.unshift(this.rollupPluginFramework);
        }
        // If the build target is for node
        else {
            // We ignore node specific imports, but allow Framework node specific imports
            let newExternal = [];
            for(let i = 0; i < external.length; i++) {
                if(!external[i].startsWith('@framework')) {
                    newExternal.push(external[i]);
                }
            }
            external = newExternal;
        }

        var rollupConfiguration = {
            input: commandLineArguments.i,
            output: {
                file: commandLineArguments.o,
                format: format,
                sourcemap: (this.environment == 'development' ? 'inline' : false),
                inlineDynamicImports: true,
                globals: globals,
            },
            external: external,
            plugins: plugins,
            onwarn: this.onRollupWarning.bind(this),
        };

        console.log('rollupConfiguration', rollupConfiguration);

        return rollupConfiguration;
    }

}

// Instatiate and export
var rollupWebTranspiler = new RollupWebTranspiler();

// Export
export default await rollupWebTranspiler.getRollupConfiguration.bind(rollupWebTranspiler);
