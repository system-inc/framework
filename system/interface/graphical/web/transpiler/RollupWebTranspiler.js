// Dependencies
import Path from 'path';
import RollupPluginAlias from '@rollup/plugin-alias';
import RollupPluginJson from '@rollup/plugin-json';
import RollupPluginDynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import RollupPluginBabel from '@rollup/plugin-babel';
import MagicString from 'magic-string';
import EsTreeWalker from 'estree-walker';

// Class
class RollupWebTranspiler {

    frameworkClassesToStripMethodsFrom = {
        'framework/system/app/App.js': {
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
        },
        'framework/system/settings/Settings.js': {
            'integrateFromFile': true,
            'constructFromFile': true,
        },
    };

    // External modules which will not be included
    importSpecifiersToIgnore = [
        // Framework
        '@framework/globals/NodeGlobals.js',

        // Firebase
        'source-map-support/register', // Used for source maps for Firebase Functions
        'firebase-functions',
        'firebase-admin',

        // Google Cloud
        '@google-cloud/storage',
        '@google-cloud/text-to-speech',

        // Various NPM Modules
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

    // Paths
    appPath = null;
    frameworkPath = null;

    constructor() {
        // We assume the current working directory is ..../(app directory)/scripts/
        this.appPath = Path.resolve('./../'); // Jump back one directory to the app path
        //console.log('this.appPath', this.appPath);

        // Derive the Framework path from this file's path
        this.frameworkPath = import.meta.url; // file://.../framework/system/interface/graphical/web/transpiler/RollupWebTranspiler.js
        this.frameworkPath = this.frameworkPath.replace('file://', ''); // .../framework/system/interface/graphical/web/transpiler/RollupWebTranspiler.js
        this.frameworkPath = Path.dirname(this.frameworkPath); // .../framework/system/interface/graphical/web/transpiler
        this.frameworkPath = Path.resolve(this.frameworkPath, '../../../../../'); // .../framework
        //console.log('this.frameworkPath', this.frameworkPath);

        this.initializeRollupPlugins();

        // Hacky way to have the browser ignore server-side modules by pointing them at an empty object
        for(var i = 0; i < this.importSpecifiersToIgnore.length; i++) {
            this.importSpecifiersToIgnoreGlobalVariables[this.importSpecifiersToIgnore[i]] = 'new Object()';
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
    }

    initializeDevelopmentRollupPlugins() {
        // Babel
        this.rollupPluginBabel = RollupPluginBabel({
            babelHelpers: 'bundled',
            plugins: [
                '@babel/plugin-proposal-class-properties', // Need this for mobile Safari and Chrome
            ],
            sourceMaps: 'both', // Generate source maps
            comments: true, // Keep comments
            compact: false, // Keep whitespace
            minified: false, // Do not minify
        });

        // Framework
        this.rollupPluginFramework = this.createRollupPluginFramework(true); // Include source map
    }

    initializeProductionRollupPlugins() {
        // Babel
        this.rollupPluginBabel = RollupPluginBabel({
            babelHelpers: 'bundled',
            plugins: [
                '@babel/plugin-proposal-class-properties', // Need this for mobile Safari and Chrome
            ],
            sourceMaps: false, // No source maps
            comments: false, // Remove comments
            compact: true, // Remove whitespace
            minified: true, // Minify
        });

        // Framework
        this.rollupPluginFramework = this.createRollupPluginFramework(false); // Include source map
    }

    createRollupPluginFramework(includeSourceMap = false) {
        var rollupWebTranspilerContext = this;

        return {
            name: 'framework', // This name will show up in warnings and errors
            transform(code, id) {
                // For performance, only run transformation specific files
                var currentFrameworkClassToStripMethodsFrom = null;
                for(let frameworkClassToStripMethodsFrom in rollupWebTranspilerContext.frameworkClassesToStripMethodsFrom) {
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
                            
                            //console.log('node.type', node.type);
                            
                            // Remove Node specific ClassMethods
                            if(node.type === 'MethodDefinition') {
                                var methodName = node.key.name;
                                //console.log('MethodDefinition', node.key.name);
                                
                                // If we should remove the method definition
                                if(methodName !== 'constructor' && rollupWebTranspilerContext.frameworkClassesToStripMethodsFrom[currentFrameworkClassToStripMethodsFrom][methodName]) {
                                    //console.log('Removing method definition', methodName, 'from', id);
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

    getRollupConfiguration(commandLineArguments) {
        // Production configuration
        if(commandLineArguments.configurationProduction) {
            console.log('Rollup.js: Using production configuration.');
            this.initializeProductionRollupPlugins();

            return [
                // Functions - Production
                {
                    input: './../builds/firebase/functions/index.js',
                    output: {
                        file: './../builds/firebase/functions/index.cjs',
                        format: 'cjs',
                        //sourcemap: 'inline', // No source maps in production
                        inlineDynamicImports: true,
                    },
                    external: this.importSpecifiersToIgnore,
                    plugins: [
                        this.rollupPluginJson,
                        this.rollupPluginDynamicImportVars,
                        this.rollupPluginAlias,
                        this.rollupPluginBabel,
                    ],
                    onwarn: RollupWebTranspiler.onRollupWarning,
                },
                // Hosting - Production
                {
                    input: './../FacesApp.js',
                    output: {
                        file: './../builds/firebase/hosting/scripts/app.js',
                        format: 'iife',
                        //sourcemap: 'inline', // No source maps in production
                        inlineDynamicImports: true,
                        globals: this.importSpecifiersToIgnoreGlobalVariables,
                    },
                    external: this.importSpecifiersToIgnore,
                    plugins: [
                        this.rollupPluginFramework,
                        this.rollupPluginJson,
                        this.rollupPluginDynamicImportVars,
                        this.rollupPluginAlias,
                        this.rollupPluginBabel,
                    ],
                    onwarn: RollupWebTranspiler.onRollupWarning,
                },
            ];
        }
        // Development configuration
        else {
            console.log('Rollup.js: Using development configuration.');
            this.initializeDevelopmentRollupPlugins();

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
                    external: this.importSpecifiersToIgnore,
                    plugins: [
                        this.rollupPluginJson,
                        this.rollupPluginDynamicImportVars,
                        this.rollupPluginAlias,
                        //this.rollupPluginBabel,
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
                        globals: this.importSpecifiersToIgnoreGlobalVariables,
                    },
                    external: this.importSpecifiersToIgnore,
                    plugins: [
                        this.rollupPluginFramework,
                        this.rollupPluginJson,
                        this.rollupPluginDynamicImportVars,
                        this.rollupPluginAlias,
                        this.rollupPluginBabel,
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
