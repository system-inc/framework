// Dependencies
import NodePath from 'path';
import RollupPluginAlias from '@rollup/plugin-alias';
import RollupPluginJson from '@rollup/plugin-json';
import RollupPluginDynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import RollupPluginBabel from '@rollup/plugin-babel';

// Class
class RollupWebTranspiler {

    filesToProcess = [
        'framework/system/app/App.js',
        'framework/system/settings/Settings.js',
    ];

    // These methods are not useful for the web
    methodDefinitionsToRemove = {
        // framework/system/app/App.js
        'initializeNodeEnvironmentSettings': true,
        'initializeNodeEnvironment': true,
        'initializeProcess': true,
        'configureStandardStreams': true,
        'configureStandardStreamsFileLog': true,
        'configureCommandLineInterface': true,
        'configureInteractiveCommandLineInterface': true,
        'importAndInitializeModules': true,
        'initializeMainProcessEnvironment': true,
        'initializeChildProcessEnvironment': true,
        'getUserPath': true,
        'getUserDesktopPath': true,

        // framework/system/settings/Settings.js
        'integrateFromFile': true,
        'constructFromFile': true,
    };

    // External modules which will not be included
    externalModules = [
        // Framework
        '@framework/globals/NodeGlobals.js',

        // Firebase
        'source-map-support/register', // Used for source maps for Firebase Functions
        'firebase-functions',
        'firebase-admin',

        // Firebase Functions
        'express',
        'busboy',
        'bent',
        '@google-cloud/storage',
        '@google-cloud/text-to-speech',

        // Firebase Hosting
        'moment',
    ];

    globalVariables = {};

    // Paths
    appPath = null;
    frameworkPath = null;

    // Rollup plugins
    rollupPluginJson = null;
    rollupPluginDynamicImportVars = null;
    rollupPluginAlias = null;

    // Development Rollup plugins
    developmentRollupPluginBabel = null;
    developmentRollupPluginFramework = null;

    // Production Rollup plugins
    productionRollupPluginBabel = null;
    productionRollupPluginFramework = null;

    constructor() {
        this.appPath = NodePath.resolve('./../');
        console.log('this.appPath', this.appPath);
        this.frameworkPath = NodePath.resolve('./../', 'libraries', 'framework');
        console.log('frameworkPath', this.frameworkPath);

        this.initializeRollupPlugins();

        // Hacky way to have the browser ignore server-side modules by pointing them at an empty object
        for(var i = 0; i < this.externalModules.length; i++) {
            this.globalVariables[this.externalModules[i]] = 'new Object()';
        }
    }

    initializeRollupPlugins() {
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
        this.developmentRollupPluginBabel = RollupPluginBabel({
            babelHelpers: 'bundled',
            plugins: [
                '@babel/plugin-proposal-class-properties',
            ],
            sourceMaps: 'both',
            comments: false, // Remove comments
            compact: true, // Remove whitespace
            minified: true, // Remove whitespace and any unneccessary code
        });
    }

    getRollupPluginFramework(options) {
        return {
            name: 'framework', // this name will show up in warnings and errors
            transform(code, id) {        
                // Only run the transformation on the files to process
                var transform = false;
                for(let i = 0; i < filesToProcess.length; i++) {
                    let fileToProcess = filesToProcess[i];
                    if(id.endsWith(fileToProcess)) {
                        transform = true;
                        break;
                    }
                }
                if(!transform) {
                    //console.log('Skipping', id);
                    return null;
                }
        
                console.log('Transforming', id);
        
                // Keep track if we changed any code
                var changed = false;
        
                // If we are using source maps
                var sourceMap = false;
        
                // Create a magic string from the code
                const magicString = new MagicString(code);
        
                
        
                // Create an AST
                let ast = null;
                try {
                    ast = this.parse(code);
                }
                catch(error) {
                    error.message += ` in ${id}`;
                    throw err;
                }
        
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
                    changed = true;
                }
        
                function removeStatement(node) {
                    const { parent } = node;
                    if(isBlock(parent)) {
                        remove(node.start, node.end);
                    }
                    else {
                        magicString.overwrite(node.start, node.end, '(void 0);');
                    }
                    changed = true;
                }
        
                function removeCallExpression(node) {
                    const { parent } = node;
                    if(parent.type === 'ExpressionStatement') {
                        removeStatement(parent);
                    }
                    else {
                        magicString.overwrite(node.start, node.end, '(void 0)');
                    }
                    changed = true;
                }
        
                EsTreeWalker.walk(
                    ast,
                    {
                        // Define the parent on entry
                        enter(node, parent) {
                            Object.defineProperty(node, 'parent', {
                                value: parent,
                                enumerable: false,
                                configurable: true
                        });
        
                        // If source maps are used update them
                        if(sourceMap) {
                            magicString.addSourcemapLocation(node.start);
                            magicString.addSourcemapLocation(node.end);
                        }
                        
                        //console.log('node.type', node.type);
                        
                        // Remove Node specific ClassMethods
                        if(node.type === 'MethodDefinition') {
                            var methodName = node.key.name;
                            //console.log('MethodDefinition', node.key.name);
                            
                            // If we should remove the method definition
                            if(methodName !== 'constructor' && methodDefinitionsToRemove[methodName]) {
                                console.log('Removing method definition', methodName, 'from', id);
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
                    },
                });
        
                // If no change has happened
                if(!changed) {
                    return null;
                }
        
                // If we changed the code, return the change
                code = magicString.toString();
                const map = sourceMap ? magicString.generateMap() : null;
                return {
                    code,
                    map,
                };
            }
        };
    }

    getRollupConfiguration(commandLineArguments) {
        // Production configuration
        if(commandLineArguments.configurationProduction) {
            console.log('Rollup.js: Using production configuration.');

            return [
                // Functions
                {
                    input: './../builds/firebase/functions/index.js',
                    output: {
                        file: './../builds/firebase/functions/index.cjs',
                        format: 'cjs',
                        //sourcemap: 'inline', // No source maps in production
                        inlineDynamicImports: true,
                    },
                    external: this.externalModules,
                    plugins: [
                        this.rollupPluginJson,
                        this.rollupPluginDynamicImportVars,
                        this.rollupPluginAlias,
                    ],
                    onwarn: RollupWebTranspiler.onRollupWarning,
                },
                // Hosting - Development
                {
                    input: './../FacesApp.js',
                    output: {
                        file: './../builds/firebase/hosting/scripts/app.js',
                        format: 'iife',
                        //sourcemap: 'inline', // No source maps in production
                        inlineDynamicImports: true,
                        globals: this.globalVariables,
                    },
                    external: this.externalModules,
                    plugins: [
                        this.rollupPluginFramework, // My Framework plugin
                        this.rollupPluginJson,
                        this.rollupPluginDynamicImportVars,
                        this.rollupPluginAlias,
                        this.rollupPluginBabelForHosting,
                    ],
                    onwarn: RollupWebTranspiler.onRollupWarning,
                },
            ];
        }
        // Development configuratio
        else {
            console.log('Rollup.js: Using development configuration.');

            return [
                // Functions
                {
                    input: './../builds/firebase/functions/index.js',
                    output: {
                        file: './../builds/firebase/functions/index.cjs',
                        format: 'cjs',
                        sourcemap: 'inline',
                        inlineDynamicImports: true,
                    },
                    external: this.externalModules,
                    plugins: [
                        this.rollupPluginJson,
                        this.rollupPluginDynamicImportVars,
                        this.rollupPluginAlias,
                    ],
                    onwarn: RollupWebTranspiler.onRollupWarning,
                },
                // Hosting - Development
                {
                    input: './../FacesApp.js',
                    output: {
                        file: './../builds/firebase/hosting/scripts/app.js',
                        format: 'iife',
                        sourcemap: 'inline',
                        inlineDynamicImports: true,
                        globals: this.globalVariables,
                    },
                    external: this.externalModules,
                    plugins: [
                        this.rollupPluginFramework, // My Framework plugin
                        this.rollupPluginJson,
                        this.rollupPluginDynamicImportVars,
                        this.rollupPluginAlias,
                        this.rollupPluginBabelForHosting,
                    ],
                    onwarn: RollupWebTranspiler.onRollupWarning,
                },
            ];
        }
    }

    static onRollupWarning(warning, warn) {
        // Skip eval warnings
        if(warning.code === 'EVAL') {
            return;
        }
    
        // Use default for everything else
        warn(warning);
    }

}

// Instatiate and export
var rollupWebTranspiler = new RollupWebTranspiler();

// Export
export default rollupWebTranspiler.getRollupConfiguration.bind(rollupWebTranspiler);
